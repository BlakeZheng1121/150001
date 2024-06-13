import {
    _decorator,
    SystemEvent,
    Label,
    SpriteFrame,
    Node,
    Prefab,
    instantiate,
    Sprite,
    UITransform,
    Layout,
    game,
    tween,
    UIOpacity,
    Tween
} from 'cc';
import { BaseScene } from '../../base/BaseScene';
import { UIOrientation } from '../../core/ui/UIOrientation';
import { UrlLogoSetting } from '../../core/ui/UrlLogoSetting';
import { GameUILayer } from '../../game/vo/GameUILayer';
import { GameUIOrientationSetting } from '../../game/vo/GameUIOrientationSetting';
import { BalanceUtil } from '../../sgv3/util/BalanceUtil';
import { GlobalTimer } from '../../sgv3/util/GlobalTimer';
import { ParticleContentTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
import { AutoPlayButton } from './AutoPlayButton';
import { BetMenu } from './BetMenu';
import { BetMenuButton } from './BetMenuButton';
import { ChangeBetButton } from './ChangeBetButton';
import { QuickSpinButton } from './QuickSpinButton';
import { QuickSpinMsg } from './QuickSpinMsg';
import { RemainSpinInfo } from './RemainSpinInfo';
import { SettingButton } from './SettingButton';
import { SettingMenuButton } from './SettingMenuButton';
import { SoundToggleButton } from './SoundToggleButton';
import { SpinButton } from './SpinButton';
const { ccclass, property } = _decorator;

@ccclass('ControlView')
export class ControlView extends BaseScene {
    public static readonly HORIZONTAL: string = 'horizontal';
    public static readonly VERTICAL: string = 'vertical';
    private readonly AUTO_MENU_BTN_WIDTH: number = 174;
    private readonly AUTO_MENU_BTN_HEIGHT: number = 96;
    private readonly BET_MENU_BTN_WIDTH: number = 174;
    private readonly BET_MENU_BTN_HEIGHT: number = 96;

    // panel button
    public buttonCallback: IControlViewMediator;

    @property({ type: SpinButton })
    public spinButton: SpinButton;

    @property({ type: QuickSpinButton })
    public quickSpinButton: QuickSpinButton;

    @property({ type: ChangeBetButton })
    public minusBetButton: ChangeBetButton;

    @property({ type: ChangeBetButton })
    public plusBetButton: ChangeBetButton;

    @property({ type: AutoPlayButton })
    public autoPlayButton: AutoPlayButton;

    @property({ type: SettingMenuButton })
    public homeButton: SettingMenuButton;

    @property({ type: SettingMenuButton })
    public reportButton: SettingMenuButton;

    @property({ type: SettingMenuButton })
    public helpButton: SettingMenuButton;

    @property({ type: SoundToggleButton })
    public soundButton: SoundToggleButton;

    @property({ type: SettingButton })
    public settingButton: SettingButton;

    @property({ type: Label })
    public autoCountTxt: Label;

    @property({ type: Label })
    public spinNumTxt: Label;

    @property({ type: Label })
    public versionTxt: Label;

    @property({ type: Sprite })
    public displayPanel: Sprite;

    @property({ type: Label })
    public balanceDisplay: Label;

    @property({ type: Label })
    public winDisplay: Label;

    @property({ type: Label })
    public totalBetDisplay: Label;

    @property({ type: Node })
    public settingMenu: Node;

    @property({ type: Node })
    public autoMenu: Node;

    @property({ type: Node })
    public autoOptions: Node;

    @property({ type: BetMenu })
    public betMenu: BetMenu;

    @property({ type: Node })
    public startButton: Node;

    @property({ type: Sprite })
    public startButtonTxt: Sprite;

    @property({ type: Prefab })
    public menuButtonPrefab: Prefab;

    @property({ type: SpriteFrame })
    public betMenuBtnNormal: SpriteFrame;

    @property({ type: SpriteFrame })
    public betMenuBtnSelected: SpriteFrame;

    @property({ type: Node })
    public freeSpinInfo: Node;

    @property({ type: RemainSpinInfo })
    public remainSpinInfo: RemainSpinInfo;

    @property({ type: Label })
    public curFreeSpinTimes: Label;

    @property({ type: Label })
    public maxFreeSpinTimes: Label;

    @property({ type: Node })
    public maxSpin: Node;

    @property({ type: QuickSpinMsg })
    public quickSpinMsg: QuickSpinMsg;

    @property({ type: Sprite })
    public jackpotWonMsgText: Sprite;

    @property({ type: Label })
    public jackpotWonMsgValue: Label;

    @property({ type: ParticleContentTool })
    public winSumAnim: ParticleContentTool;

    @property({ type: UrlLogoSetting })
    public providerInfo: UrlLogoSetting;

    public curTotalJackpotWonValue: number = 0;

    public betMenuButtons: Array<BetMenuButton> = new Array<BetMenuButton>();

    public spinTotalTimes: number = 0;
    private isSpinMax: boolean = false;
    private displayPanelTween: Tween<UIOpacity>;

    private _uiOrientation: Array<UIOrientation> | null = null;

    private get uiOrientation() {
        if (this._uiOrientation == null) {
            this._uiOrientation = this.getComponentsInChildren(UIOrientation);
        }
        return this._uiOrientation;
    }

    private _gameUIOrientation: Array<GameUIOrientationSetting> | null = null;

    private get gameUIOrientation() {
        if (this._gameUIOrientation == null) {
            this._gameUIOrientation = this.getComponentsInChildren(GameUIOrientationSetting);
        }
        return this._gameUIOrientation;
    }

    private _uiLayer: Array<GameUILayer> | null = null;

    private get uiLayer() {
        if (this._uiLayer == null) {
            this._uiLayer = this.getComponentsInChildren(GameUILayer);
        }
        return this._uiLayer;
    }

    protected onLoad() {
        super.onLoad();
        game.addPersistRootNode(this.node);
        this.registerPanelButton();
        this.initJackpotWonMsgObject();
        this.quickSpinMsg.init();
    }

    private registerPanelButton() {
        this.spinButton.node.on(SystemEvent.EventType.TOUCH_END, this.buttonCallback.spin, this.buttonCallback);
        this.quickSpinButton.node.on(
            SystemEvent.EventType.TOUCH_END,
            this.buttonCallback.quickSpin,
            this.buttonCallback
        );
        this.minusBetButton.node.on(SystemEvent.EventType.TOUCH_END, this.buttonCallback.minusBet, this.buttonCallback);
        this.plusBetButton.node.on(SystemEvent.EventType.TOUCH_END, this.buttonCallback.plusBet, this.buttonCallback);
        this.autoPlayButton.node.on(SystemEvent.EventType.TOUCH_END, this.buttonCallback.autoPlay, this.buttonCallback);
        this.reportButton.node.on(SystemEvent.EventType.TOUCH_END, this.buttonCallback.openReport, this.buttonCallback);
        this.helpButton.node.on(SystemEvent.EventType.TOUCH_END, this.buttonCallback.openHelp, this.buttonCallback);
        this.settingButton.node.on(
            SystemEvent.EventType.TOUCH_END,
            this.buttonCallback.openSettingMenu,
            this.buttonCallback
        );
        this.soundButton.node.on(
            SystemEvent.EventType.TOUCH_END,
            () => this.buttonCallback.toggleSound(),
            this.buttonCallback
        );
        this.homeButton.node.on(SystemEvent.EventType.TOUCH_END, this.buttonCallback.gotoGameHall, this.buttonCallback);
        this.totalBetDisplay.node.parent.on(
            SystemEvent.EventType.TOUCH_END,
            this.buttonCallback.totalBet,
            this.buttonCallback
        );
    }

    /** 更改orientation mode */
    public changeOrientation(mode: string, scene: string) {
        let ishorizontal = mode == ControlView.HORIZONTAL;
        // for (let i = 0; i < this.uiOrientation.length; i++) {
        //     this.uiOrientation[i].changeOrientation(ishorizontal);
        // }

        for (let i = 0; i < this.gameUIOrientation.length; i++) {
            this.gameUIOrientation[i].changeOrientation(ishorizontal, scene);
        }

        for (let i = 0; i < this.uiLayer.length; i++) {
            this.uiLayer[i].changeOrientation(ishorizontal);
        }
    }

    /** 轉場模式 */
    public transitionMode(status: boolean) {
        this.quickSpinButton.node.active = !status;
        this.minusBetButton.node.active = !status;
        this.plusBetButton.node.active = !status;
        this.autoPlayButton.node.active = !status;
        this.settingButton.node.active = !status;
        this.spinButton.node.active = !status;
        // this.startButton.active = status;
        this.displayPanel.node.active = !status;
    }

    /**
     * 創建選單
     * @param _options 選單內容
     * @param onClickCallback 回傳方法
     */
    public createAutoMenu(_options: number[], _onClickCallback: Function): void {
        let i: number = _options.length - 1;
        while (i >= 0) {
            this.autoOptions.addChild(this.addAutoMenuButton(_options[i].toString(), _onClickCallback));
            i--;
        }
    }

    private addAutoMenuButton(countTxt: string, callback: Function): Node {
        const menuButtonNode = instantiate(this.menuButtonPrefab);
        const uiTransform = menuButtonNode.getComponent(UITransform);
        const label = menuButtonNode.getComponentInChildren(Label);
        uiTransform.contentSize.set(this.AUTO_MENU_BTN_WIDTH, this.AUTO_MENU_BTN_HEIGHT);
        label.string = countTxt;
        menuButtonNode.on(
            SystemEvent.EventType.TOUCH_END,
            () => {
                callback(countTxt);
            },
            this.buttonCallback
        );

        return menuButtonNode;
    }

    public createBetMenu(_options: number[], _onClickCallback: Function): void {
        let i: number = 0;
        while (i < _options.length) {
            this.betMenu.content.node.addChild(this.addBetButton(i, _options[i], _onClickCallback));
            i++;
        }
    }

    // TODO: 新增 bet 按鈕
    private addBetButton(i: number, countTxt: number, callback: Function): Node {
        const betButton = instantiate(this.menuButtonPrefab);
        const uiTransform = betButton.getComponent(UITransform);
        betButton.addComponent(BetMenuButton);
        uiTransform.contentSize.set(this.BET_MENU_BTN_WIDTH, this.BET_MENU_BTN_HEIGHT);
        const menuButton = betButton.getComponent(BetMenuButton);
        menuButton.setTotalBet(countTxt);
        menuButton.setStateSprite(this.betMenuBtnNormal, this.betMenuBtnSelected);
        this.betMenuButtons.push(menuButton);
        betButton.on(
            SystemEvent.EventType.TOUCH_END,
            () => {
                callback(menuButton);
            },
            this.buttonCallback
        );

        return betButton;
    }

    public hideAllMenu() {
        this.hideAutoMenu();
        this.buttonCallback.closeSettingMenu();
        this.hideBetMenu();
    }

    /** 隱藏 auto play 選單 */
    public hideAutoMenu(): void {
        this.autoMenu.active = false;
    }

    public hideBetMenu() {
        this.betMenu.node.active = false;
    }

    public checkMenuStatus() {
        return this.settingMenu.active || this.autoMenu.active || this.betMenu.node.active;
    }

    /** 更新彩金 */
    public updateCreditLabel(_val: string): void {
        this.balanceDisplay.string = _val;
    }

    /** 更新贏得彩金 */
    public updateWinLabel(_val: string): void {
        this.winDisplay.string = _val;
    }

    /** 更新組合押注 */
    public updateTotalBetLabel(_val: string): void {
        this.totalBetDisplay.string = _val;
    }

    /** 更新 Spin Number */
    public updateSpinNumber(_seq: number) {
        this.spinNumTxt.string = _seq.toString();
    }

    /** 加速狀態 */
    public updateSpeedMode(state: string): void {
        this.quickSpinButton.changeState(state);
    }

    private initJackpotWonMsgObject() {
        this.closeJackpotWonMsg();
    }

    public closeJackpotWonMsg() {
        this.jackpotWonMsgValue.node.parent.active = false;
        this.jackpotWonMsgValue.string = '';
        this.curTotalJackpotWonValue = 0;
    }

    public showJackpotWonMsg(jpWon: number) {
        this.jackpotWonMsgValue.node.parent.active = true;
        this.addJackpotWonValue(jpWon);
        this.jackpotWonMsgValue.string = BalanceUtil.formatBalanceWithDollarSign(this.curTotalJackpotWonValue / 100);
    }

    private addJackpotWonValue(jpWon: number) {
        this.curTotalJackpotWonValue += jpWon;
    }

    /** free game相關UI顯示API */
    public showFreeInfoMsg(): void {
        this.freeSpinInfo.active = true;
        this.maxSpin.active = this.isSpinMax;
    }

    public showRemainInfoMsg(): void {
        this.remainSpinInfo.node.active = true;
        this.maxSpin.active = this.isSpinMax;
    }

    public showMaxSpinInfo(isMax: boolean) {
        this.isSpinMax = isMax;
        this.maxSpin.active = this.isSpinMax;
    }

    public closeFreeInfoMsg(): void {
        this.remainSpinInfo.node.active = false;
        this.freeSpinInfo.active = false;
        this.maxSpin.active = false;
    }

    /** 更新 free game次數 資訊 */
    public updateMsgContent(_curTimes: number, _maxTimes: number): void {
        if (_curTimes != null) {
            this.curFreeSpinTimes.string = '' + _curTimes;
        }
        this.maxFreeSpinTimes.string = '' + _maxTimes;
        if (_curTimes == 0) {
            this.isSpinMax = false;
        }
    }

    public addMsgContent(data: any, isMax: boolean): void {
        let retriggerTime: number[] = data as number[];
        this.isSpinMax = isMax;
        this.changeRetriggerTotalTimes(retriggerTime[0], retriggerTime[1], retriggerTime[2]);
    }

    private changeRetriggerTotalTimes(_readyAddTimes: number, _curTotalTimes: number, _runningTimer: number): void {
        this.spinTotalTimes = _curTotalTimes;
        tween(<ControlView>this)
            .to(
                _runningTimer - 0.5, // 0.5 秒，停頓時間.
                { spinTotalTimes: _curTotalTimes + _readyAddTimes },
                {
                    onUpdate: (target) => {
                        (target as ControlView).onChangeTotalTimes();
                    }
                }
            )
            .start();

        GlobalTimer.getInstance()
            .registerTimer('addSpinTimes', _runningTimer, this.changeTotalTimesFinish, this)
            .start();
    }

    private onChangeTotalTimes(): void {
        this.updateMsgContent(null, Math.round(this.spinTotalTimes));
    }

    private changeTotalTimesFinish(): void {
        GlobalTimer.getInstance().removeTimer('addSpinTimes');
        this.maxSpin.active = this.isSpinMax; //依據資料，決定是否顯示MaxSpin UI.
    }

    public showFeatureSelection() {
        this.minusBetButton.node.active = false;
        this.plusBetButton.node.active = false;
        this.displayPanelTween.start();
    }

    protected onDestroy() {
        super.onDestroy();
    }
}

export interface IControlViewMediator {
    spin();
    quickSpin();
    autoPlay();
    totalBet();
    toggleSound();
    openHelp();
    openReport();
    openMoreGames();
    gotoGameHall();
    minusBet();
    plusBet();
    openSettingMenu();
    closeSettingMenu();
    releaseTempWon(releaseValue: number);
}
