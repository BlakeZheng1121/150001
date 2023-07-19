import { EventKeyboard, KeyCode, _decorator } from 'cc';
import BaseMediator from '../../base/BaseMediator';
import { ControlView, IControlViewMediator } from '../view/ControlView';
import {
    GameStateProxyEvent,
    ReelEvent,
    AutoPlayEvent,
    ScreenEvent,
    StateWinEvent,
    CtrlPanelBtnState,
    ViewMediatorEvent,
    SpinResultProxyEvent,
    DragonUpEvent,
    WinEvent,
    SceneEvent,
    FreeGameEvent,
    SoundEvent
} from '../../sgv3/util/Constant';
import { StateMachineProxy } from '../../sgv3/proxy/StateMachineProxy';
import { CoreGameDataProxy } from '../../core/proxy/CoreGameDataProxy';
import { GameDataProxy } from '../../sgv3/proxy/GameDataProxy';
import { WebBridgeProxy } from '../../sgv3/proxy/WebBridgeProxy';
import { ReelDataProxy } from '../../sgv3/proxy/ReelDataProxy';
import { TSMap } from '../../core/utils/TSMap';
import { Logger } from '../../core/utils/Logger';
import { GameScene } from '../../sgv3/vo/data/GameScene';
import { SpinButton } from '../view/SpinButton';
import { BalanceUtil } from '../../sgv3/util/BalanceUtil';
import { AutoPlayButton } from '../view/AutoPlayButton';
import { AutoPlayClickOptionCommand } from '../../sgv3/command/autoplay/AutoPlayClickOptionCommand';
import { SettingButton } from '../view/SettingButton';
import { QuickSpinButton } from '../view/QuickSpinButton';
import { ChangeBetButton } from '../view/ChangeBetButton';
import { BetMenuButton } from '../view/BetMenuButton';
import { FreeGameOneRoundResult } from '../../sgv3/vo/result/FreeGameOneRoundResult';
import { SceneManager } from '../../core/utils/SceneManager';
import { GameSceneData } from '../../sgv3/vo/config/GameSceneData';
import { NetworkProxy } from '../../core/proxy/NetworkProxy';
import { SettingMenuButton } from '../view/SettingMenuButton';
import { AudioManager } from '../../ta/tool/AudioManager';
import { AudioClipsEnum } from '../../game/vo/enum/SoundMap';
import { KeyboardProxy } from '../../core/proxy/KeyboardProxy';
import { DEBUG } from 'cc/env';
import { ServiceProvider } from '../../core/vo/NetworkType';
const { ccclass } = _decorator;

@ccclass('ControlViewMediator')
export class ControlViewMediator extends BaseMediator<ControlView> implements IControlViewMediator {
    protected mySceneData: GameSceneData = null;

    private stateMap: TSMap<string, string>;

    constructor(name?: string, component?: any) {
        super(name, component);
        Logger.i('[ControlViewMediator] constructor()');
        ControlViewMediator.NAME = this.mediatorName;
        this.webAPI();
        this.stateMap = new TSMap<string, string>();
    }

    public onRegister() {
        Logger.i('ControlViewMediator initial done');
    }

    protected lazyEventListener(): void {
        this.mySceneData = this.gameDataProxy.getSceneDataByName(GameScene.Game_1);
        this.view.buttonCallback = this;
    }

    public listNotificationInterests(): string[] {
        let eventList = [
            SceneEvent.LOAD_BASE_COMPLETE,
            SceneEvent.LOAD_UI_VERSION_COMPLETE,
            SceneEvent.LOAD_GAME_DATA_COMPLETE,
            SceneEvent.LOAD_SPIN_LOGO_URL,
            GameStateProxyEvent.ON_WIN_STATE_CHANGED,
            ReelEvent.ON_TURBO_STATE_CHANGE,
            AutoPlayEvent.ON_TIMES_CHANGE,
            StateWinEvent.ON_GAME1_TRANSITIONS,
            StateWinEvent.ON_BTN_STATE_CHANGED,
            ViewMediatorEvent.JACKPOT_WON_SHOW,
            ViewMediatorEvent.JACKPOT_WON_CLOSE,
            SceneManager.EV_ORIENTATION_VERTICAL,
            SceneManager.EV_ORIENTATION_HORIZONTAL,
            SpinResultProxyEvent.RESPONSE_SPIN,
            ViewMediatorEvent.SHOW_WON_SPIN_DATA,
            ViewMediatorEvent.SHOW_FREE_SPIN_MSG,
            ViewMediatorEvent.CLOSE_FREE_SPIN_MSG,
            ViewMediatorEvent.SHOW_RETRIGGER_BOARD,
            CtrlPanelBtnState.CREATE_BET_MENU,
            CtrlPanelBtnState.CREATE_BONUS_UPGRADE_BET_RANGE_INFO,
            StateWinEvent.ON_GAME2_EXITING,
            ViewMediatorEvent.SHOW_FEATURE_SELECTION,
            DragonUpEvent.ON_RESPIN_NEXT_END,
            FreeGameEvent.ON_BEFORE_END_SCORE_SHOW_SKIP,
            ViewMediatorEvent.ENTER
        ];

        let event: string;
        for (let key in this.stateMachineProxy['stateEventMap']) {
            event = this.stateMachineProxy['stateEventMap'][key];
            this.stateMap.set(event, key);
            eventList.push(event);
        }
        // 連接 SFS 時監聽 Keyboard 事件
        if (!DEBUG && window['serviceProvider'] === ServiceProvider.DEFAULT) {
            eventList.push(KeyboardProxy.EV_KEY_DOWN);
        }

        return eventList;
    }

    public handleNotification(notification: puremvc.INotification): void {
        let name = notification.getName();
        let freeGameOneRoundResult = this.gameDataProxy.curRoundResult as FreeGameOneRoundResult;
        switch (name) {
            case SceneEvent.LOAD_UI_VERSION_COMPLETE:
                // 組版本號
                this.view.versionTxt.string = this.gameDataProxy.gameAndUiVer;
                break;
            case SceneEvent.LOAD_GAME_DATA_COMPLETE:
                this.onLoadGameDataComplete();
                break;
            case SceneEvent.LOAD_BASE_COMPLETE:
                this.controlViewInit();
                break;
            case ReelEvent.ON_TURBO_STATE_CHANGE:
                this.view.updateQuickSpinMode(this.reelDataProxy.isTurboMode);
                this.webBridgeProxy.getWebFunRequest(this, 'updateTurboMode', this.reelDataProxy.isTurboMode);
                this.view.quickSpinMsg.showMsg(this.reelDataProxy.isTurboMode, this.gameDataProxy.isShowTurboModeMsg);
                break;
            case SceneManager.EV_ORIENTATION_VERTICAL:
                this.gameDataProxy.orientationEvent = name;
                this.view?.changeOrientation(ControlView.VERTICAL, this.gameDataProxy.curScene);
                break;
            case SceneManager.EV_ORIENTATION_HORIZONTAL:
                this.gameDataProxy.orientationEvent = name;
                this.view?.changeOrientation(ControlView.HORIZONTAL, this.gameDataProxy.curScene);
                break;
            case AutoPlayEvent.ON_TIMES_CHANGE:
                // 有可能一開遊戲就觸發 Error 事件，此時 controlView 還沒建立
                if (this.view) {
                    this.toggleAutoNum(true);
                    const autoCountTxt = this.gameDataProxy.maxAutoTimes - this.gameDataProxy.curAutoTimes;
                    this.view.autoCountTxt.string = autoCountTxt.toString();
                }
                // auto play 自動結束時數字需改回 spin btn
                if (this.gameDataProxy.curAutoTimes === this.gameDataProxy.maxAutoTimes) {
                    this.view.autoPlayButton.changeState(AutoPlayButton.STATUS_ON);
                    this.toggleAutoNum(false);
                }
                break;
            case this.stateMachineProxy['stateEventMap'].game1Init:
                this.gameDataProxy.isShowTurboModeMsg = true;
                this.updateTotalBetTxt();
                break;
            case CtrlPanelBtnState.CREATE_BET_MENU:
                this.createBetMenu();
                break;
            case CtrlPanelBtnState.CREATE_BONUS_UPGRADE_BET_RANGE_INFO:
                this.createBonusUpgradeBetRangeInfo();
                break;
            case this.stateMachineProxy['stateEventMap'].game2Init:
            case this.stateMachineProxy['stateEventMap'].game3Init:
            case this.stateMachineProxy['stateEventMap'].game4Init:
                this.gameDataProxy.isShowTurboModeMsg = true;
                if (!this.gameDataProxy.onAutoPlay) {
                    this.view.autoPlayButton.disabledBtn(true);
                } else {
                    this.view.autoPlayButton.disabledBtn(false);
                }
                this.view.showMaxSpinInfo(false);
                break;
            case this.stateMachineProxy['stateEventMap'].game1Idle:
                this.view.autoPlayButton.disabledBtn(false);
            case this.stateMachineProxy['stateEventMap'].game2Idle:
                if (this.gameDataProxy.curScene === GameScene.Game_1) {
                    if (this.gameDataProxy.onAutoPlay) {
                        this.view.autoPlayButton.changeState(AutoPlayButton.STATUS_PAUSE);
                    } else {
                        this.view.autoPlayButton.changeState(AutoPlayButton.STATUS_ON);
                    }
                }
                break;
            case StateWinEvent.ON_GAME1_TRANSITIONS:
                this.gameDataProxy.isShowTurboModeMsg = false;
                this.view.quickSpinButton.disabledBtn(false);
                if (this.gameDataProxy.curTurboMode) {
                    this.reelDataProxy.isTurboMode = this.gameDataProxy.curTurboMode;
                }
                this.view.transitionMode(false);

                break;
            case StateWinEvent.ON_BTN_STATE_CHANGED:
                if (!this.view) return;
                let spinBtnState: string = this.checkSpinBtnState(notification.getBody());
                this.view.spinButton.changeState(spinBtnState);
                this.view.providerInfo.disableBtn(spinBtnState !== SpinButton.STATUS_ON);
                // 改按鈕狀態
                switch (this.checkControlPanelBtnEnable()) {
                    case CtrlPanelBtnState.DISABLED:
                        this.hideAllMenu();
                        this.view.settingButton.changeState(SettingButton.STATUS_DISABLED);
                        //this.view.quickSpinButton.disabledBtn(true);
                        if (!this.gameDataProxy.onAutoPlay) {
                            this.view.autoPlayButton.disabledBtn(true);
                        }
                        this.view.minusBetButton.changeState(ChangeBetButton.STATUS_DISABLED);
                        this.view.plusBetButton.changeState(ChangeBetButton.STATUS_DISABLED);
                        this.changeTotalBetTxtIcon(TotalBetIcon.STATUS_DISABLED);

                        this.webBridgeProxy.isSpinning(true);
                        break;
                    case CtrlPanelBtnState.CAN_CLICK:
                        this.view.settingButton.changeState(SettingButton.STATUS_ON);
                        this.view.minusBetButton.changeState(ChangeBetButton.STATUS_ON);
                        this.view.plusBetButton.changeState(ChangeBetButton.STATUS_ON);
                        this.changeTotalBetTxtIcon(TotalBetIcon.STATUS_ON);
                        if (this.reelDataProxy.isTurboMode) {
                            this.view.quickSpinButton.changeState(QuickSpinButton.STATUS_ON);
                        } else {
                            this.view.quickSpinButton.changeState(QuickSpinButton.STATUS_OFF);
                        }
                        this.view.autoPlayButton.disabledBtn(false);
                        this.view.quickSpinButton.disabledBtn(false);

                        this.webBridgeProxy.isSpinning(false);
                        break;
                }
                break;
            case ViewMediatorEvent.JACKPOT_WON_SHOW:
                this.view.showJackpotWonMsg(notification.getBody());
                break;
            case ViewMediatorEvent.JACKPOT_WON_CLOSE:
                this.view.closeJackpotWonMsg();
                break;
            case ViewMediatorEvent.SHOW_FREE_SPIN_MSG:
                switch (this.gameDataProxy.curScene) {
                    case GameScene.Game_2:
                        this.view.showFreeInfoMsg();
                        break;
                    case GameScene.Game_4:
                        this.view.showRemainInfoMsg();
                        break;
                }
                break;
            case ViewMediatorEvent.CLOSE_FREE_SPIN_MSG:
                this.view.closeFreeInfoMsg();
                break;
            case ViewMediatorEvent.SHOW_WON_SPIN_DATA:
                switch (this.gameDataProxy.curScene) {
                    case GameScene.Game_2:
                        this.view.updateMsgContent(1, notification.getBody());
                        break;
                    case GameScene.Game_4:
                        this.view.remainSpinInfo.setCurSpinTime(notification.getBody());
                        break;
                }
                break;
            case SpinResultProxyEvent.RESPONSE_SPIN:
                this.onResponseSpin(notification.getBody());
                break;
            case ViewMediatorEvent.SHOW_RETRIGGER_BOARD:
                this.view.addMsgContent(
                    notification.getBody(),
                    freeGameOneRoundResult.displayLogicInfo.maxTriggerCountFlag
                );
                break;
            case DragonUpEvent.ON_RESPIN_NEXT_END:
                let infoArray: Array<any> = notification.getBody();
                this.view.remainSpinInfo.updateReSpinInfo(infoArray[0]);
                this.view.showMaxSpinInfo(infoArray[0] == 0 ? false : infoArray[1]);
                break;
            case FreeGameEvent.ON_BEFORE_END_SCORE_SHOW_SKIP:
                this.winScoreSum();
                break;
            case ViewMediatorEvent.SHOW_FEATURE_SELECTION:
                this.view.spinButton.isChangeDisableColor(true);
                this.gameDataProxy.isShowTurboModeMsg = false;
                this.view.quickSpinButton.disabledBtn(true);
                this.gameDataProxy.curTurboMode = this.reelDataProxy.isTurboMode;
                if (this.reelDataProxy.isTurboMode) {
                    this.reelDataProxy.isTurboMode = false;
                }
                break;
            case ViewMediatorEvent.ENTER:
                this.view.spinButton.isChangeDisableColor(false);
                break;
            case KeyboardProxy.EV_KEY_DOWN:
                this.spinByKeyboard(notification.getBody());
                break;
            case SceneEvent.LOAD_SPIN_LOGO_URL:
                this.initLogo(notification.getBody() as string);
                break;
        }
    }

    /**
     * 初始化 controlView
     */
    private controlViewInit() {
        this.createAutoMenu();
        // 組版本號
        this.view.versionTxt.string = this.gameDataProxy.gameAndUiVer;
        this.onLoadGameDataComplete();
        this.networkProxy.setPlatformApi();
        // 初始化橫直式及語系
        if (this.view) {
            this.view.changeOrientation(
                this.gameDataProxy.orientationEvent === SceneManager.EV_ORIENTATION_HORIZONTAL
                    ? ControlView.HORIZONTAL
                    : ControlView.VERTICAL,
                this.gameDataProxy.curScene
            );
        }
        this.initLogo(this.gameDataProxy.providerLogoUrl);
    }

    public onLoadGameDataComplete() {
        if (this.gameDataProxy.isDemoGame) {
            this.view.reportButton.changeState(SettingMenuButton.STATUS_DISABLED);
        }

        if (!this.gameDataProxy.hasGoHome) {
            this.view.homeButton.changeState(SettingMenuButton.STATUS_DISABLED);
        }
    }

    private onResponseSpin(roundInfo: Array<number>) {
        if (roundInfo == null) {
            return;
        }
        //Index 0:為roundNumber, Index 1:為TotalRound
        switch (this.gameDataProxy.curScene) {
            case GameScene.Game_2:
                this.view.updateMsgContent(roundInfo[0], roundInfo[1]);
                break;
            case GameScene.Game_4:
                this.view.remainSpinInfo.setCurSpinTime(roundInfo[1] - roundInfo[0]);
                if (roundInfo[1] - roundInfo[0] == 0) {
                    this.view.showMaxSpinInfo(false);
                }
                break;
        }
    }

    /** 開給 Web 使用的接口 */
    // TODO: 移動到webProxy
    private webAPI(): void {
        window['updateHtmlCredit'] = (credit, cash) => this.updateHtmlCredit(credit, cash);
        window['updateHtmlPlayerWin'] = (credit, cash) => this.updatePlayerWin(credit, cash);
        window['updateSpinNumber'] = (data) => this.view.updateSpinNumber(data);
    }

    /**
     * 更新 total bet 數字
     */
    private updateTotalBetTxt() {
        this.view.updateTotalBetLabel(
            BalanceUtil.formatBalanceWithDollarSign(this.gameDataProxy.curTotalBet) + TotalBetIcon.STATUS_ON
        );
        this.sendNotification(ScreenEvent.ON_BET_CHANGE);
    }

    private changeTotalBetTxtIcon(state: string) {
        switch (state) {
            case TotalBetIcon.STATUS_ON:
            case TotalBetIcon.STATUS_DISABLED:
            case TotalBetIcon.STATUS_OFF:
                let icon = state;
                this.view.updateTotalBetLabel(
                    BalanceUtil.formatBalanceWithDollarSign(this.gameDataProxy.curTotalBet) + icon
                );
                break;
        }
    }

    /**
     * 清除 目前的贏分 & 贏分表演 & Jackpot 贏分
     */
    private clearPlayerWinTxt() {
        let clearWinTxt = BalanceUtil.formatBalanceWithDollarSign(0);
        if (this.view.winDisplay.string != clearWinTxt) {
            this.view.updateWinLabel(clearWinTxt); //贏分顯示歸零
            //清除贏分表演
            this.sendNotification(WinEvent.FORCE_WIN_DISPOSE);
        }
        this.view.closeJackpotWonMsg();
    }

    /** 
      * 是否顯示 auto play 數字並隱藏 spin 按鈕
    @status (boolean) true-開啟 false-關閉 
    */
    private toggleAutoNum(status: boolean) {
        this.view.spinButton.disableBtn(status);
        this.view.providerInfo.disableBtn(status);
        this.view.autoCountTxt.node.active = status;
    }

    /**
     * 更新 cash
     */
    private updateHtmlCredit(credit: string, cash: string) {
        this.view.updateCreditLabel(cash);
    }

    /**
     * 更新 win
     */
    private updatePlayerWin(credit: string, cash: string) {
        this.view.updateWinLabel(cash);
    }

    public spin() {
        window['onSpinBtnClick']();
    }

    // 使用鍵盤 spin
    private spinByKeyboard(event: EventKeyboard) {
        if (
            event instanceof EventKeyboard &&
            (event.keyCode == KeyCode.SPACE || event.keyCode == KeyCode.ENTER || event.keyCode == KeyCode.NUM_ENTER)
        ) {
            this.spin();
        }
    }

    private winScoreSum() {
        this.view.winSumAnim.ParticlePlay();
        let totalWin: number = this.gameDataProxy.convertCredit2Cash(this.gameDataProxy.spinEventData.playerTotalWin);
        this.view.updateWinLabel(BalanceUtil.formatBalanceWithDollarSign(totalWin));
        AudioManager.Instance.play(AudioClipsEnum.Free_Calculation);
    }

    /** 點擊減少押注*/
    public minusBet() {
        if (
            this.gameDataProxy.totalBetIdx >= this.gameDataProxy.totalBetList.length - 1 ||
            this.checkControlPanelBtnEnable() !== CtrlPanelBtnState.CAN_CLICK
        ) {
            return;
        } else {
            this.gameDataProxy.totalBetIdx += 1;
            this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
        }
        this.hideAllMenu();
        this.gameDataProxy.resetBetInfo(this.gameDataProxy.totalBetList[this.gameDataProxy.totalBetIdx]);
        this.updateTotalBetTxt();
        this.clearPlayerWinTxt();
    }

    /** 點擊增加押注*/
    public plusBet() {
        if (this.gameDataProxy.totalBetIdx <= 0 || this.checkControlPanelBtnEnable() !== CtrlPanelBtnState.CAN_CLICK) {
            return;
        } else {
            this.gameDataProxy.totalBetIdx -= 1;
            this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
        }
        this.hideAllMenu();
        this.gameDataProxy.resetBetInfo(this.gameDataProxy.totalBetList[this.gameDataProxy.totalBetIdx]);
        this.updateTotalBetTxt();
        this.clearPlayerWinTxt();
    }

    /** 點擊turbo按鈕 */
    public quickSpin() {
        if (
            this.gameDataProxy.curScene !== GameScene.Game_1 ||
            this.gameDataProxy.gameState === StateMachineProxy.GAME1_FEATURESELECTION
        ) {
            return;
        }
        this.hideAllMenu();
        this.reelDataProxy.isTurboMode = !this.reelDataProxy.isTurboMode;
        this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
    }

    /** 開關設定選單 */
    public openSettingMenu() {
        if (this.checkControlPanelBtnEnable() !== CtrlPanelBtnState.CAN_CLICK) return;
        if (this.view.checkMenuStatus()) {
            this.hideAllMenu();
            return;
        }

        this.view.settingMenu.active = true;
        this.networkProxy.changeOptionStatus(true);

        this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
    }

    public closeSettingMenu() {
        if (this.view.settingMenu.active) {
            this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
        }
        this.view.settingMenu.active = false;
        this.networkProxy.changeOptionStatus(false);
    }

    /** 創建自動玩選單 */
    private createAutoMenu() {
        this.view.createAutoMenu(this.gameDataProxy.initEventData.autoPlayTimesList, (autoCountNum) =>
            this.onClickAutoOption(autoCountNum)
        );
    }

    /** 點擊自動玩按鈕 */
    public autoPlay() {
        if (
            (this.gameDataProxy.curScene !== GameScene.Game_1 && !this.gameDataProxy.onAutoPlay) ||
            this.view.autoPlayButton.isDisabledBtn
        ) {
            return;
        }
        if (this.view.checkMenuStatus()) {
            this.hideAllMenu();
            this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
            return;
        }

        if (
            !this.gameDataProxy.onAutoPlay &&
            !this.gameDataProxy.isSpinning &&
            this.view.autoPlayButton.currentState === AutoPlayButton.STATUS_ON
        ) {
            this.view.autoMenu.active = true;
        } else if (this.view.autoPlayButton.currentState === AutoPlayButton.STATUS_PAUSE) {
            this.sendNotification(AutoPlayClickOptionCommand.NAME, [0, 0]);
            this.view.autoPlayButton.changeState(AutoPlayButton.STATUS_ON);
        }
        this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
        if (this.gameDataProxy.curScene !== GameScene.Game_1 && !this.gameDataProxy.onAutoPlay) {
            this.view.autoPlayButton.disabledBtn(true);
        }
    }

    private createBetMenu() {
        this.view.createBetMenu(this.gameDataProxy.totalBetList, (betMenuBtn) => this.onClickBetOption(betMenuBtn));
    }

    private createBonusUpgradeBetRangeInfo() {
        const jpPoolData = this.gameDataProxy.initEventData.executeSetting.jackpotSetting.jackpotPoolData[0];
        const wayBetList = this.gameDataProxy.initEventData.executeSetting.baseGameSetting.betSpec.waysBetList;
        const betRangeMap = jpPoolData.jackpotExtendSetting.betRangeMap;

        // 須將 JackpotBet 結合顯示出來
        let betRangeMapGroup: Map<number, number[]> = new Map<number, number[]>();
        for (let i = 0; i < betRangeMap.length; i++) {
            if (betRangeMapGroup.has(betRangeMap[i])) {
                betRangeMapGroup.get(betRangeMap[i]).push(wayBetList[i]);
            } else {
                let bet: number[] = [];
                bet.push(wayBetList[i]);
                betRangeMapGroup.set(betRangeMap[i], bet);
            }
        }

        // For totalBetList Index
        let tempMinBetIndex: number = NaN;
        let tempMaxBetIndex: number = NaN;
        let minBets: number[] = [];
        let maxBets: number[] = [];
        betRangeMapGroup.forEach((value, key) => {
            for (let i = this.gameDataProxy.jackpotAllBetList.length - 1; i >= 0; i--) {
                if (this.gameDataProxy.jackpotAllBetList[i] >= value[0]) {
                    tempMinBetIndex = i;
                    break;
                }
            }
            for (let i = 0; i < this.gameDataProxy.jackpotAllBetList.length; i++) {
                if (this.gameDataProxy.jackpotAllBetList[i] <= value[value.length - 1]) {
                    tempMaxBetIndex = i;
                    break;
                }
            }

            minBets.push(this.gameDataProxy.totalBetList[tempMinBetIndex]);
            maxBets.push(this.gameDataProxy.totalBetList[tempMaxBetIndex]);
        });
    }

    /** 點擊total bet 開啟選單*/
    public totalBet() {
        if (this.checkControlPanelBtnEnable() !== CtrlPanelBtnState.CAN_CLICK) return;
        if (this.view.checkMenuStatus()) {
            this.hideAllMenu();
            return;
        }

        if (!this.view.betMenu.node.active) {
            this.view.betMenu.node.active = true;
            this.changeTotalBetTxtIcon(TotalBetIcon.STATUS_OFF);
            for (const btn of this.view.betMenuButtons) {
                if (btn.currentState === BetMenuButton.STATUS_ACTIVE) {
                    btn.changeState(BetMenuButton.STATUS_DOWN);
                }
                if ((btn.btnVal || NaN) === this.gameDataProxy.curTotalBet) {
                    btn.changeState(BetMenuButton.STATUS_ACTIVE);
                    continue;
                }
            }
            this.view.betMenu.node.active = true;
            this.networkProxy.changeOptionStatus(true);
        }

        this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
    }

    /** 開關音量 */
    public toggleSound() {
        let onOff = !this.gameDataProxy.soundEnableState;
        this.toggleMute(onOff);
    }
    public toggleMute(value: boolean) {
        this.gameDataProxy.soundEnableState = value;
        AudioManager.Instance.audioOnOff(value);
        this.view.soundButton.changeState(value);
        this.closeSettingMenu();
    }

    /** 開啟Help */
    public openHelp() {
        try {
            // this.webBridgeProxy.openHelp(this.gameDataProxy.curTotalBet, this.gameDataProxy.gameVer);
            this.webBridgeProxy.openHelp(
                JSON.stringify({
                    lang: this.gameDataProxy.language,
                    bet: this.gameDataProxy.curTotalBet,
                    gameVer: this.gameDataProxy.gameVer
                })
            );
            this.view.settingMenu.active = false;
        } catch (error) {
            Logger.e(error);
        }

        this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
    }

    /** 開啟Report */
    public openReport() {
        try {
            if (this.view.reportButton.currentState === SettingButton.STATUS_DISABLED) {
                return;
            }
            this.webBridgeProxy.openReport();
            this.view.settingMenu.active = false;
        } catch (error) {
            Logger.e(error);
        }

        this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
    }

    /** 開啟more game*/
    public openMoreGames() {
        try {
            this.webBridgeProxy.openMoreGameMenu();
            this.view.settingMenu.active = false;
        } catch (error) {
            Logger.e(error);
        }

        this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
    }

    /** 返回Game Hall */
    public gotoGameHall() {
        if (!this.gameDataProxy.hasGoHome) return;
        try {
            this.webBridgeProxy.quitGame();
        } catch (error) {
            Logger.e(error);
        }

        this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
    }

    /** 點擊自動玩面板選單 */
    private onClickAutoOption(autoCountNum: string): void {
        this.hideAllMenu();

        this.view.autoPlayButton.changeState(AutoPlayButton.STATUS_PAUSE);
        this.sendNotification(AutoPlayClickOptionCommand.NAME, [0, +autoCountNum]);
        //this.soundProxy.play(SoundDataMap.BUTTON_PRESS); // no use
        this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
    }

    /** 關閉所有選單 */
    private hideAllMenu() {
        this.view.hideAllMenu();
        if (this.view.betMenu && this.checkControlPanelBtnEnable() == CtrlPanelBtnState.CAN_CLICK) {
            this.changeTotalBetTxtIcon(TotalBetIcon.STATUS_ON);
        }
        this.networkProxy.changeOptionStatus(false);
        if (this.view.autoMenu.active || this.view.betMenu.node.active || this.view.settingMenu.active) {
            this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
        }
    }

    /** 點擊Bet面板選單 */
    private onClickBetOption(betMenuBtn: BetMenuButton): void {
        this.hideAllMenu();
        this.gameDataProxy.resetBetInfo(betMenuBtn.btnVal);
        this.gameDataProxy.totalBetList.forEach((bet, index) => {
            if (bet === betMenuBtn.btnVal) {
                this.gameDataProxy.totalBetIdx = index;
                return;
            }
        });
        this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
        this.updateTotalBetTxt();
        this.clearPlayerWinTxt();
    }

    /** 
     * 檢查 spin 狀態
    @param state 回傳true強制開啟
    @return SpinButton state
    */
    public checkSpinBtnState(state?: boolean | null): string | undefined {
        const self = this;

        if (!this.gameDataProxy.onAutoPlay) {
            if (
                self.gameDataProxy.gameState === StateMachineProxy.GAME1_IDLE ||
                (state != null && this.gameDataProxy.curScene === GameScene.Game_1)
            ) {
                return SpinButton.STATUS_ON;
            }
        }
        return SpinButton.STATUS_STOP;
    }

    /**
     *  ctrl Panel btn 狀態控制
     * @return CtrlPanelBtnState
     */
    public checkControlPanelBtnEnable(): number {
        const self = this;
        if (
            self.gameDataProxy.onAutoPlay ||
            self.gameDataProxy.curScene !== GameScene.Game_1 ||
            (self.gameDataProxy.gameState !== StateMachineProxy.GAME1_IDLE &&
                self.gameDataProxy.gameState !== StateMachineProxy.GAME1_SHOWWIN) ||
            (self.gameDataProxy.gameState === StateMachineProxy.GAME1_SHOWWIN && !self.gameDataProxy.runWinComplete) ||
            self.gameDataProxy.isHitSpecial()
        ) {
            return CtrlPanelBtnState.DISABLED;
        }
        return CtrlPanelBtnState.CAN_CLICK; //可take win、可觸發自身功能、可滾滿時要開啟 (急停QA説例外)
    }

    public releaseTempWon(releaseValue: number) {
        this.gameDataProxy.tempWonCredit -= releaseValue;
        this.updateTempWon();
    }

    public updateTempWon() {
        this.webBridgeProxy.updateHtmlCredit();
    }

    public setTempTotalWon(tempValue: number) {
        this.gameDataProxy.tempWonCredit = tempValue;
    }

    protected initLogo(url: string) {
        this.view.providerInfo.url = url;
        this.view.providerInfo.updateFrame();
    }

    // ======================== Get Set ========================
    private _gameDataProxy: GameDataProxy;
    public get gameDataProxy(): GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GameDataProxy.NAME) as GameDataProxy;
        }

        return this._gameDataProxy;
    }

    private _webBridgeProxy: WebBridgeProxy;
    public get webBridgeProxy(): WebBridgeProxy {
        if (!this._webBridgeProxy) {
            this._webBridgeProxy = this.facade.retrieveProxy(WebBridgeProxy.NAME) as WebBridgeProxy;
        }
        return this._webBridgeProxy;
    }

    private _reelDataProxy: ReelDataProxy;
    public get reelDataProxy(): ReelDataProxy {
        if (!this._reelDataProxy) {
            this._reelDataProxy = this.facade.retrieveProxy(ReelDataProxy.NAME) as ReelDataProxy;
        }
        return this._reelDataProxy;
    }

    protected _stateMachineProxy: StateMachineProxy;
    public get stateMachineProxy(): StateMachineProxy {
        if (!this._stateMachineProxy) {
            this._stateMachineProxy = this.facade.retrieveProxy(StateMachineProxy.NAME) as StateMachineProxy;
        }
        return this._stateMachineProxy;
    }

    protected getGameDataProxy(): CoreGameDataProxy {
        return this.facade.retrieveProxy(CoreGameDataProxy.NAME) as CoreGameDataProxy;
    }

    protected getGameData(): any {
        return this.webBridgeProxy.getWebObj('gameData');
    }

    protected _networkProxy: NetworkProxy;
    protected get networkProxy(): NetworkProxy {
        if (!this._networkProxy) {
            this._networkProxy = this.facade.retrieveProxy(NetworkProxy.NAME) as NetworkProxy;
        }
        return this._networkProxy;
    }
}

export class TotalBetIcon {
    public static STATUS_ON = 'X';
    public static STATUS_OFF = 'Y';
    public static STATUS_DISABLED = 'Z';
}
