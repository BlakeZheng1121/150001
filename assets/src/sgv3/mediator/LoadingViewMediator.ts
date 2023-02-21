import { assetManager, Component, director, instantiate, Prefab, Node, _decorator } from 'cc';
import BaseMediator from '../../base/BaseMediator';
import { ChangeBalanceCommand } from '../../core/command/ChangeBalanceCommand';
import { SFLoginCommand } from '../../core/command/SFLoginCommand';
import { NetworkProxy } from '../../core/proxy/NetworkProxy';
import { Logger } from '../../core/utils/Logger';
import { SceneManager } from '../../core/utils/SceneManager';
import { AudioManager } from '../../ta/tool/AudioManager';
import { CoreDefaultSettingCommand } from '../command/CoreDefaultSettingCommand';
import { CheckRecoveryFlowCommand } from '../command/recovery/CheckRecoveryFlowCommand';
import { GameDataProxy } from '../proxy/GameDataProxy';
import { WebBridgeProxy } from '../proxy/WebBridgeProxy';
import { SceneEvent } from '../util/Constant';
import { GlobalTimer } from '../util/GlobalTimer';
import { LoadingView } from '../view/LoadingView';
import { GameScene } from '../vo/data/GameScene';
import { GameProxyEvent } from '../vo/event/GameProxyEvent';
import { LoadEvent } from '../vo/event/LoadEvent';
import { PendingEvent } from '../vo/event/PendingEvent';
import { KibanaLog, LogType } from '../vo/log/KibanaLog';
import { SGGameLoginReturn } from '../vo/result/SGGameLoginReturn';
const { ccclass } = _decorator;

@ccclass('LoadingViewMediator')
export default class LoadingViewMediator extends BaseMediator<LoadingView> {
    protected rootView: Component;
    protected baseLoadList: string[] = [];
    protected extraLoadList: string[] = [];
    protected headGroup: any;
    protected triggerPending: boolean = false;
    protected pendEventInfo: PendingEvent = undefined;

    protected delayCloseLoadingTime: number = 0;

    public isEnterGame: boolean = false;

    private totalAssetsNum: number = 0; // 所有載入資源數量
    private finishedAssetsNum: number = 0; // 完成載入資源數量
    private retryInterval: number = 500;

    /** preload 要預載的資源 */
    protected baseList(): string[] {
        return [GameScene.Game_1, 'common', 'control', 'winBoard'];
    }

    /** 進入basegame後 要載的資源 */
    protected extendList(): string[] {
        return [GameScene.Game_2, GameScene.Game_3, GameScene.Game_4];
    }

    public constructor(name?: string, component?: any) {
        super(name, component);
        LoadingViewMediator.NAME = this.mediatorName;
        this.setLoadingList(this.baseList(), this.extendList());
    }

    public onRegister(): void {
        Logger.i('LoadingViewMediator initial done');
    }

    protected lazyEventListener(): void {}

    public listNotificationInterests(): Array<any> {
        return [
            SFLoginCommand.EV_CONNECTION,
            LoadEvent.LOAD_GROUP_COMPLETE,
            LoadEvent.LOAD_ITEM_PROGRESS,
            GameProxyEvent.RESPONSE_INIT,
            SceneEvent.LOAD_LOGO_URL,
            SceneEvent.BATCH_LOADING_COMPLETE,
            SceneEvent.PENDING_EVENT_AND_SHOW_LOADING,
            SceneManager.EV_ORIENTATION_VERTICAL,
            SceneManager.EV_ORIENTATION_HORIZONTAL
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const self = this;
        let name = notification.getName();
        switch (name) {
            case SFLoginCommand.EV_CONNECTION:
                self.onConnectServer(notification);
                self.gameDataProxy.loadUserSetting();
                break;
            case LoadEvent.LOAD_GROUP_COMPLETE:
                self.onLoadGroupComplete(notification);
                break;
            case LoadEvent.LOAD_ITEM_PROGRESS:
                self.onResourceProgress(notification);
                break;
            case GameProxyEvent.RESPONSE_INIT:
                self.afterInitData();
                break;
            case SceneEvent.PENDING_EVENT_AND_SHOW_LOADING:
                self.triggerPendLoading(notification);
                break;
            case SceneEvent.LOAD_LOGO_URL:
                this.initLogo(notification.getBody() as string);
                break;
        }
    }

    /**
     * 設定要載入的 GroupName 列表
     * @param _baseList 基本列表(載完就進遊戲畫面)
     * @param _extraList 額外列表
     */
    public setLoadingList(_baseList: string[], _extraList: string[]): void {
        this.baseLoadList = _baseList;
        this.extraLoadList = _extraList;
        this.totalAssetsNum = this.baseLoadList.length;
        if (this.extraLoadList.length == 0) this.gameDataProxy.isCompletedBatchLoading = true;
    }

    /** slot 需要取得initData後才行 */
    protected onConnectServer(notification: puremvc.INotification): void {
        let gameLoginReturn: SGGameLoginReturn = notification.getBody() as SGGameLoginReturn;
        // refactor 之後繼承SFSLoginCommand處理
        this.gameDataProxy.userId = gameLoginReturn.showName;
        this.gameDataProxy.setBmd(gameLoginReturn.balance, true);
        this.sendNotification(ChangeBalanceCommand.NAME, gameLoginReturn);
        // slot 必須在連線後送出初始化要求封包才能繼續做
        this.netProxy.sendInitRequest();
    }

    public onResourceProgress(notification: puremvc.INotification): void {
        let progress: number = notification.getBody();
        this.view?.setProgress(progress);
    }

    /** 寫入Log */
    public writeLog(url: string) {
        let log = new KibanaLog();
        log.fileURL = url;
        log.errorCode = 220;
        Logger.init(LogType.ERROR_LOADITEM, this.gameDataProxy.gameType, this.gameDataProxy.machineType);
        Logger.kibana(log);
    }

    protected onLoadGroupComplete(v: puremvc.INotification): void {
        // preload 素材完成、開始 smartfox 連線
        if (v.getBody() == LoadEvent.PRELOAD_GROUP) {
            if (!!this.netProxy.getConfig() && this.gameDataProxy.curScene == GameScene.Init) this.netProxy.connect();
        } else {
            if (this.headGroup == v.getBody()) {
                GlobalTimer.getInstance()
                    .registerTimer(
                        LoadingViewMediator.NAME,
                        0.5,
                        () => {
                            GlobalTimer.getInstance().removeTimer(LoadingViewMediator.NAME);
                            this.notifyBaseResComplete();

                            this.view.loadBaseResComplete(() => this.delayEnterLobby());

                            const extraListLength = this.extraLoadList.length;
                            if (extraListLength == 0) {
                                this.sendNotification(SceneEvent.BATCH_LOADING_COMPLETE);
                            } else {
                                this.loadAssetsBundle(this.extraLoadList);
                            }
                        },
                        this
                    )
                    .start();
            } else {
                this.gameDataProxy.isCompletedBatchLoading = true;
                if (this.pendEventInfo) {
                    this.sendNotification(this.pendEventInfo.triggerEvent, this.pendEventInfo.eventParam);
                }
                this.pendEventInfo = null;
                this.view.loadingComplete();
            }
        }
    }

    /** 因為一開始的loading畫面，如果沒有delay會看到loading bar未載完就進入遊戲的狀況 */
    protected delayEnterLobby(): void {
        //進行 Recovery流程
        this.sendNotification(CheckRecoveryFlowCommand.NAME);

        this.isEnterGame = true;
        this.closeLoadingView();
    }

    /** 關閉loadingView */
    protected closeLoadingView(): void {
        this.view.hideContent();
        this.webBridgeProxy.notifyEnterGame();
    }

    /**
     * slot 必須在取得預設資料後才處理
     */
    protected afterInitData() {
        if (this.gameDataProxy.isMaintaining) {
            this.gameDataProxy.isMaintaining = false;
            this.webBridgeProxy.resetWebErrors();
            this.sendNotification(CoreDefaultSettingCommand.NAME);
        } else {
            this.headGroup = this.baseLoadList;
            this.downloadBundle('common')
                .then(() => this.downloadBundle('scenes'))
                .then(() => this.downloadBundle('control-panel'))
                .then(() => this.loadAssetsBundle(this.baseLoadList))
                .catch((error) => {
                    // 一段時間後retry
                    setTimeout(() => {
                        this.afterInitData();
                    }, this.retryInterval);
                });
        }
    }

    downloadBundle(bundleName) {
        return new Promise((resolve, reject) => {
            let existBundle = assetManager.getBundle(bundleName);
            if (existBundle) return resolve(existBundle);

            assetManager.loadBundle(bundleName, (error, bundle) => {
                if (error) {
                    return reject(error);
                }
                resolve(bundle);
            });
        });
    }

    protected preloadGroup(groupList: string[], setProgress: boolean) {
        let sceneName = groupList.shift();
        if (sceneName) {
            director.preloadScene(
                sceneName,
                setProgress
                    ? (completedCount, totalCount) => {
                          this.onLoadSceneProgress(completedCount, totalCount);
                      }
                    : null,
                (error) => {
                    if (!error) {
                        this.onAssetLoaded(sceneName, groupList);
                    }
                    if (groupList.length > 0) {
                        this.preloadGroup(groupList, setProgress);
                    }
                }
            );
        } else {
            return;
        }
    }
    /** 使用 Asset bundle 實例各場景的 prefab */
    private async loadAssetsBundle(groupList: string[]) {
        while (groupList.length > 0) {
            let assetName = groupList.shift();
            if (assetName == 'common') {
                await this.loadPrefab('common', 'Common-Panel')
                    .then((prefab) => this.instantiatePrefab(prefab))
                    // .then((obj) => this.wait(obj))
                    .then((commonNode: Node) => {
                        commonNode.children.forEach((node) => {
                            node.active = false;
                        });
                    })
                    .then((obj) => this.wait(obj, 100));
            } else if (assetName == 'control') {
                await this.loadPrefab('control-panel', 'Control-Panel')
                    .then((prefab) => this.instantiatePrefab(prefab))
                    .then((obj) => this.wait(obj, 100));
            } else if (assetName == 'winBoard') {
                await this.loadPrefab('common', 'Game_WinBoardView')
                    .then((prefab) => this.instantiatePrefab(prefab))
                    .then((winBoardNode: Node) => {
                        winBoardNode.active = false;
                    })
                    .then((obj) => this.wait(obj, 100));
            } else {
                await this.loadPrefab('scenes', assetName)
                    .then((prefab) => this.instantiatePrefab(prefab))
                    // .then((obj) => this.wait(obj))
                    .then((node: Node) => {
                        node.active = false;
                        node.setSiblingIndex(1);
                    })
                    .then((obj) => this.wait(obj, 100));
            }
        }

        this.sendNotification(LoadEvent.LOAD_GROUP_COMPLETE, groupList);
    }

    loadPrefab(bundleName, assetName) {
        return new Promise((resolve, reject) => {
            assetManager.getBundle(bundleName).load(assetName, Prefab, (err, prefab) => {
                if (err) {
                    return reject(err);
                }

                Logger.i(assetName + ' load complete');
                resolve(prefab);
            });
        });
    }

    instantiatePrefab(prefab) {
        return new Promise((resolve, reject) => {
            const node: Node = instantiate(prefab);
            director.getScene().getChildByName('View').addChild(node);
            // 完成載入數量
            this.finishedAssetsNum++;
            this.onLoadSceneProgress(this.finishedAssetsNum, this.totalAssetsNum);
            resolve(node);
        });
    }

    wait(obj, millisecond) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(obj);
            }, millisecond);
        });
    }

    private onLoadSceneProgress(completedCount: number, totalCount: number) {
        let progress = completedCount / totalCount;
        this.sendNotification(LoadEvent.LOAD_ITEM_PROGRESS, progress);
    }

    private onAssetLoaded(assetName: string, groupList: string[]) {
        Logger.i(assetName + ' load complete');
        if (groupList.length == 0) {
            this.sendNotification(LoadEvent.LOAD_GROUP_COMPLETE, groupList);
        }
    }

    /**
     * 通知baseGame complete
     * @author luke
     */
    protected notifyBaseResComplete() {
        const self = this;
        self.sendNotification(CoreDefaultSettingCommand.NAME);
        self.sendNotification(SceneEvent.LOAD_BASE_COMPLETE);
        self.sendNotification(self.gameDataProxy.orientationEvent);
        this.webBridgeProxy.notifyGameReady();
        AudioManager.Instance.loadAudio();
    }

    /** 觸發 pendloading */
    protected triggerPendLoading(notification: puremvc.INotification) {
        this.triggerPending = true;
        this.pendEventInfo = notification.getBody() as PendingEvent;
        this.view.showPendingLoading();
    }

    protected initLogo(url: string) {
        this.view.logo.url = url;
        this.view.logo.updateFrame();
    }
    // ======================== Get Set ========================
    protected _netProxy: NetworkProxy;
    public get netProxy(): NetworkProxy {
        return this.facade.retrieveProxy(NetworkProxy.NAME) as NetworkProxy;
    }

    protected _gameDataProxy: GameDataProxy;
    public get gameDataProxy(): GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GameDataProxy.NAME) as GameDataProxy;
        }
        return this._gameDataProxy;
    }

    protected _webBridgeProxy: WebBridgeProxy;
    public get webBridgeProxy(): WebBridgeProxy {
        if (!this._webBridgeProxy) {
            this._webBridgeProxy = this.facade.retrieveProxy(WebBridgeProxy.NAME) as WebBridgeProxy;
        }
        return this._webBridgeProxy;
    }
}
