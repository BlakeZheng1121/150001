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
    private readonly AUTO_MENU_BTN_WIDTH: number = 86;
    private readonly AUTO_MENU_BTN_HEIGHT: number = 68;
    private readonly BET_MENU_BTN_WIDTH: number = 154;
    private readonly BET_MENU_BTN_HEIGHT: number = 64;

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

    public setLanguage(lang: string) {
        this.changeLocale(lang);
    }

    /**更改語系 */
    protected changeLocale(locale: string) {
        this.quickSpinMsg.changeLocale(locale);
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
    /** 更新 UILayer 的子物件 */
    private updateUILayer() {
        for (let i = 0; i < this.uiLayer.length; i++) {
            this.uiLayer[i].updateChildren();
        }
    }

    /** 轉場模式 */
    public transitionMode(status: boolean) {
        this.quickSpinButton.node.active = !status;
        this.minusBetButton.node.active = !status;
        this.plusBetButton.node.active = !status;
        this.autoPlayButton.node.active = !status;
        this.settingButton.node.active = !status;
        this.spinButton.node.parent.active = !status;
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
            this.autoMenu.addChild(this.addAutoMenuButton(i, _options[i].toString(), _onClickCallback));
            i--;
        }
        this.updateUILayer();
    }

    public addAutoMenuButton(i: number, countTxt: string, callback: Function): Node {
        const menuBtnNode = instantiate(this.menuButtonPrefab);
        const uiTransform = menuBtnNode.getComponent(UITransform);
        const label = menuBtnNode.getComponentInChildren(Label);
        uiTransform.contentSize.set(this.AUTO_MENU_BTN_WIDTH, this.AUTO_MENU_BTN_HEIGHT);
        label.string = countTxt;
        menuBtnNode.on(
            SystemEvent.EventType.TOUCH_END,
            () => {
                callback(countTxt);
            },
            this.buttonCallback
        );

        return menuBtnNode;
    }

    public createBetMenu(_options: number[], _onClickCallback: Function): void {
        let i: number = 0;
        while (i < _options.length) {
            this.betMenu.content.node.addChild(this.addBetButton(i, _options[i], _onClickCallback));
            i++;
        }
        // 調整 bet menu 排版
        let layout = this.betMenu.content.getComponent(Layout);
        let height: number = this.betMenu.transform.height - this.betMenu.content.height;

        layout.constraintNum = Math.ceil(_options.length * 0.5);
        this.betMenu.content.height =
            layout.paddingTop +
            layout.paddingBottom +
            (layout.constraintNum - 1) * layout.spacingY +
            layout.constraintNum * this.BET_MENU_BTN_HEIGHT;

        this.betMenu.transform.height = height + this.betMenu.content.height;
        this.betMenu.titleTransform.width =
            this.BET_MENU_BTN_WIDTH * 2 + layout.paddingLeft + layout.paddingRight + layout.spacingX;
        this.betMenu.title.string = BalanceUtil.dollarISO;
    }
    // TODO: 新增 bet 按鈕
    public addBetButton(i: number, countTxt: number, callback: Function): Node {
        const betBtn = instantiate(this.menuButtonPrefab);
        const uiTransform = betBtn.getComponent(UITransform);
        betBtn.addComponent(BetMenuButton);
        uiTransform.contentSize.set(this.BET_MENU_BTN_WIDTH, this.BET_MENU_BTN_HEIGHT);
        const menuBtn = betBtn.getComponent(BetMenuButton);
        menuBtn.setTotalBet(countTxt);
        menuBtn.setStateSprite(this.betMenuBtnNormal, this.betMenuBtnSelected);
        this.betMenuButtons.push(menuBtn);
        betBtn.on(
            SystemEvent.EventType.TOUCH_END,
            () => {
                callback(menuBtn);
            },
            this.buttonCallback
        );

        return betBtn;
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
    public updateQuickSpinMode(_val: boolean): void {
        if (_val) {
            this.quickSpinButton.changeState(QuickSpinButton.STATUS_ON);
        } else {
            this.quickSpinButton.changeState(QuickSpinButton.STATUS_OFF);
        }
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
