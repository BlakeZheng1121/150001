import { _decorator } from 'cc';
import { StateMachineCommand } from '../../core/command/StateMachineCommand';
import { StateMachineObject } from '../../core/proxy/CoreStateMachineProxy';
import { Logger } from '../../core/utils/Logger';
import { SceneManager } from '../../core/utils/SceneManager';
import { BaseGameViewMediator } from '../../sgv3/mediator/base/BaseGameViewMediator';
import { StateMachineProxy } from '../../sgv3/proxy/StateMachineProxy';
import { WebBridgeProxy } from '../../sgv3/proxy/WebBridgeProxy';
import { GameStateProxyEvent, JackpotPool, StateWinEvent, ViewMediatorEvent } from '../../sgv3/util/Constant';
import { GlobalTimer } from '../../sgv3/util/GlobalTimer';
import { GameScene } from '../../sgv3/vo/data/GameScene';
import { AudioManager } from '../../ta/tool/AudioManager';
import { GAME_GameDataProxy } from '../proxy/GAME_GameDataProxy';
import { Game_2_View } from '../view/Game_2_View';
import { BGMClipsEnum } from '../vo/enum/SoundMap';
const { ccclass } = _decorator;

@ccclass('Game_2_ViewMediator')
export class Game_2_ViewMediator extends BaseGameViewMediator<Game_2_View> {
    public static readonly NAME: string = 'Game_2_ViewMediator';

    private onShowWonSpinsBoard: boolean = false; //顯示贏得FreeGame開始看板

    protected defaultInterestList: string[] = [
        SceneManager.EV_ORIENTATION_VERTICAL,
        SceneManager.EV_ORIENTATION_HORIZONTAL,
        GameStateProxyEvent.ON_SCENE_BEFORE_CHANGE,
        GameStateProxyEvent.ON_SCENE_CHANGED,
        ViewMediatorEvent.LEAVE
    ];

    protected myInterestsList: string[] = [
        SceneManager.EV_ORIENTATION_VERTICAL,
        SceneManager.EV_ORIENTATION_HORIZONTAL,
        GameStateProxyEvent.ON_SCENE_BEFORE_CHANGE,
        StateWinEvent.ON_GAME2_OPENING,
        StateWinEvent.ON_GAME2_EXITING,
        StateWinEvent.SHOW_LAST_WIN_COMPLETE,
        StateWinEvent.SHOW_LAST_CREDIT_BOARD,
        ViewMediatorEvent.SHOW_WON_SPIN_DATA,
        ViewMediatorEvent.HIDE_ALL_BOARD,
        ViewMediatorEvent.ENTER,
        ViewMediatorEvent.SHOW_RETRIGGER_BOARD
    ];

    public constructor(name?: string, component?: any) {
        super(name, component);
        window;
        Logger.i('[' + Game_2_ViewMediator.NAME + '] constructor()');

        // 取得該場景的資料
        let parseName: string[] = Game_2_ViewMediator.NAME.split('_');
        this.mySceneName = parseName[0] + '_' + parseName[1];
        this.mySceneData = this.gameDataProxy.getSceneDataByName(this.mySceneName);
        this.myGameScene = this.mySceneName;
    }

    protected lazyEventListener(): void {}

    public handleNotification(notification: puremvc.INotification): void {
        super.handleNotification(notification);
        const self = this;
        let name = notification.getName();
        switch (name) {
            case SceneManager.EV_ORIENTATION_VERTICAL:
                self.onOrientationVertical();
                break;
            case SceneManager.EV_ORIENTATION_HORIZONTAL:
                self.onOrientationHorizontal();
                break;
            case GameStateProxyEvent.ON_SCENE_BEFORE_CHANGE: // 讓Mediator進入畫面前必須要重整監聽事件
                self.refreshMediatorEventList();
                self.setAwardMessage(this.gameDataProxy.curGameOperation);
                self.view.changeOrientation(this.gameDataProxy.orientationEvent, this.gameDataProxy.curScene);
                break;
            case StateWinEvent.ON_GAME2_OPENING:
                self.showOpeningEffect(notification.getBody());
                break;
            case StateWinEvent.SHOW_LAST_WIN_COMPLETE:
                self.showCompleteBoard();
                break;
            case StateWinEvent.SHOW_LAST_CREDIT_BOARD:
                self.showWonCreditBoard(notification.getBody());
                break;
            case ViewMediatorEvent.SHOW_WON_SPIN_DATA:
                self.showWonSpins(notification.getBody());
                break;
            case ViewMediatorEvent.HIDE_ALL_BOARD:
                self.hideGame2AllBoard();
                break;
            case ViewMediatorEvent.SHOW_RETRIGGER_BOARD:
                self.showRetriggerBoard(notification.getBody());
                break;
            case StateWinEvent.ON_GAME2_EXITING:
                self.showExitingEffect();
                break;
        }
    }

    /** 建立畫面 */
    protected initView(): void {}

    /** 進入場景處理 */
    protected enterMediator() {
        if (this.gameDataProxy.curScene !== this.mySceneName) return;
        this.view.node.active = true;
        this.facade.sendNotification(JackpotPool.CHANGE_SCENE);
        this.webBridgeProxy.sendGameState('FreeGame');
        this.facade.sendNotification(
            StateMachineCommand.NAME,
            new StateMachineObject(StateMachineProxy.GAME2_TRANSITIONS)
        );
        AudioManager.Instance.play(BGMClipsEnum.BGM_FreeGame).loop(true).volume(0).fade(1, 1);
    }

    /** 離開場景處理 */
    protected leaveMediator() {
        if (this.gameDataProxy.preScene !== GameScene.Init && this.gameDataProxy.preScene !== this.mySceneName) return;
        this.view.node.active = false;
        this.facade.sendNotification(JackpotPool.EXIT_SCENE, GameScene.Game_2);

        AudioManager.Instance.stop(BGMClipsEnum.BGM_FreeGame).fade(0, 1);
    }

    /** 更新 award 場次 */
    private setAwardMessage(curGameOperation: string) {
        this.view.setAwardMessage(curGameOperation);
    }

    /** 執行橫式轉換 */
    protected onOrientationHorizontal(): void {
        let curScene = this.gameDataProxy.curScene;
        this.view?.changeOrientation(SceneManager.EV_ORIENTATION_HORIZONTAL, curScene);
    }

    /** 執行直式轉換 */
    protected onOrientationVertical(): void {
        let curScene = this.gameDataProxy.curScene;
        this.view?.changeOrientation(SceneManager.EV_ORIENTATION_VERTICAL, curScene);
    }

    /** 贏得場次 */
    protected showWonSpins(totalRound: number) {
        this.onShowWonSpinsBoard = true;
    }

    /** 開場表演 */
    protected showOpeningEffect(visible: boolean) {
        // this.view.showReelRising(visible);
        // if (visible === true) {
        //     this.soundProxy.stop(SoundDataMap.GAME_2_TRANSITION_02);
        // } else {
        //     this.soundProxy.play(SoundDataMap.GAME_2_BGM);
        // }
    }

    /** 場景離開 表演 */
    protected showExitingEffect() {
        let runTime = this.mySceneData.completeFadeOutSceneTime;
        // this.view.fadeOutSceneEffect(runTime); //淡出效果
    }

    /** 關閉 Game2所有Board UI */
    protected hideGame2AllBoard() {
        // this.view.hideAllBoard(); //關閉ＵＩ物件
    }

    /** 顯示retrigger面板 */
    protected showRetriggerBoard(data: any) {
        let retriggerTime: number[] = data as number[];
    }

    /** 顯示遊戲結束面板 */
    protected showCompleteBoard() {
        // this.view.showCompleteBoard();
    }

    /** 顯示結算分數面板 */
    protected showWonCreditBoard(cashAmount: number) {
        // this.view.showWonCreditBoard(cashAmount, this.mySceneData.wonCreditBoardRunningTime);
    }

    private onSpinDown() {
        if (!this.onShowWonSpinsBoard) {
            return;
        }

        // this.view.showPressSpinEffect();
        // this.sendNotification(SoundEvent.SOUNDCMD, [SoundEvent.PLAY_NORMALSOUND, BaseSoundParms.WEBBTN]); //播放Spin按鈕音效
        // this.soundProxy.play(SoundDataMap.GAME_2_TRANSITION_SPIN);

        this.onShowWonSpinsBoard = false;

        GlobalTimer.getInstance()
            .registerTimer(
                'pressFX_Timer',
                0.66,
                () => {
                    this.facade.sendNotification(
                        StateMachineCommand.NAME,
                        new StateMachineObject(StateMachineProxy.GAME2_TRANSITIONS)
                    );
                    GlobalTimer.getInstance().removeTimer('pressFX_Timer');
                },
                this
            )
            .start();
    }

    // ======================== Get Set ========================
    protected _gameDataProxy: GAME_GameDataProxy;
    protected get gameDataProxy(): GAME_GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GAME_GameDataProxy.NAME) as GAME_GameDataProxy;
        }
        return this._gameDataProxy;
    }

    private _webBridgeProxy: WebBridgeProxy;
    protected get webBridgeProxy(): WebBridgeProxy {
        if (!this._webBridgeProxy) {
            this._webBridgeProxy = this.facade.retrieveProxy(WebBridgeProxy.NAME) as WebBridgeProxy;
        }
        return this._webBridgeProxy;
    }
}
