import { CoreGameDataProxy } from '../../core/proxy/CoreGameDataProxy';
import { Logger } from '../../core/utils/Logger';
import { MathUtil } from '../../core/utils/MathUtil';
import { PlayerData } from '../../core/vo/PlayerData';
import { CommonSetting } from '../vo/config/CommonSetting';
import { GameData } from '../vo/config/GameData';
import { GameSceneData } from '../vo/config/GameSceneData';
import { SceneSetting } from '../vo/config/SceneSetting';
import { AllWinData } from '../vo/data/AllWinData';
import { GameScene } from '../vo/data/GameScene';
import { GameHitPattern } from '../vo/enum/GameHitPattern';
import { GameModule } from '../vo/enum/GameModule';
import { WinBoardState } from '../vo/enum/WinBoardState';
import { JackpotEvent } from '../vo/event/JackpotEvent';
import { SymbolMatchInfo } from '../vo/match/SymbolMatchInfo';
import { SpinResult } from '../vo/result/SpinResult';
import { UserSetting } from '../vo/setting/UserSetting';
import { WebBridgeProxy } from './WebBridgeProxy';
import { InitEvent } from '../vo/event/InitEvent';
import { GameStateSetting } from '../vo/setting/GameStateSetting';
import { GameStateResult } from '../vo/result/GameStateResult';
import { CommonGameResult } from '../vo/result/CommonGameResult';
import { SpecialHitInfo } from '../vo/enum/SpecialHitInfo';
import { StateMachineProxy } from './StateMachineProxy';
import { TSMap } from '../../core/utils/TSMap';
import { NetworkProxy } from '../../core/proxy/NetworkProxy';
import { RecoveryData } from '../vo/data/RecoveryData';
import { SpecialFeatureResult } from '../vo/result/SpecialFeatureResult';
import { WinType } from '../vo/enum/WinType';

/** 全遊戲資料 */
export class GameDataProxy extends CoreGameDataProxy {
    protected _gameData: GameData;
    protected _userSetting: UserSetting;

    protected _sceneSetting: SceneSetting;
    protected _commonSetting: CommonSetting;

    protected _gameSceneMap: TSMap<string, string>;

    public constructor(gameData: GameData = new GameData()) {
        super(gameData, new PlayerData());
        this._gameData = this.gameData as GameData;
        this._gameSceneMap = new TSMap<string, string>();
    }

    // ============================ Refactor ============================
    /**
     * 取得場景資料
     * @param sceneName 場景名稱，如Game_1
     * */
    public getSceneDataByName(sceneName: string): GameSceneData {
        return this._sceneSetting.getGameSceneDataByName(sceneName);
    }

    /**
     * 透過 遊戲類型 取得對應的贏分模式
     * @param sceneName 數學狀態id
     */
    public getInitShowPatternById(sceneName: string): GameHitPattern {
        let stateSetting: GameStateSetting = this.getStateSettingByName(sceneName);
        if (stateSetting != undefined) {
            return GameHitPattern[stateSetting.gameHitPattern];
        } else {
            Logger.w('[StateId ' + sceneName + '] Get HitPattern Error');
            return undefined;
        }
    }

    /**
     * 透過 遊戲類型 取得對應的設定
     * @param sceneName 數學狀態id
     */
    public getStateSettingById(sceneName: string): GameStateSetting {
        if (this.initEventData.gameStateSettings.length > 0) {
            let entity: GameStateSetting;
            for (entity of this.initEventData.gameStateSettings) {
                if (entity.gameSceneId == sceneName) return entity;
            }
        } else {
            Logger.w('[StateId ' + sceneName + '] Get StateSetting By Id Error, ExecuteSetting id not match!!');
            return undefined;
        }
    }

    /**
     * 透過 遊戲場景名稱 取得對應的設定
     * @param sceneName 遊戲場景名稱
     */
    public getStateSettingByName(sceneName: string): GameStateSetting {
        let result: GameStateSetting = this.getStateSettingById(sceneName);
        if (result != undefined) return result;
        else {
            Logger.w('[SceneName ' + sceneName + '] Get StateSetting By Name Error, ExecuteSetting id not match!!');
            return undefined;
        }
    }

    /** 取得 場景資料 */
    public get sceneSetting(): SceneSetting {
        return this._sceneSetting;
    }
    public set sceneSetting(_val: SceneSetting) {
        this._sceneSetting = _val;
    }

    /** 取得本機儲存的 key 值 */
    public get localStorageKey(): string {
        return 'slot_' + this.userName + '_' + this.machineType;
    }

    public get userName(): string {
        return this.userId;
    }

    // public setWinSetting(): boolean {
    //     let success = true;
    //     let runTime = 0;
    //     this.sceneSetting.winSetting = new WinSetting();
    //     this.sceneSetting.winSetting.winTypeList = [
    //         BigWinType.normal_1,
    //         BigWinType.normal_2,
    //         BigWinType.normal_3,
    //         BigWinType.normal_4,
    //         BigWinType.normal_5,
    //         BigWinType.normal_6,
    //         BigWinType.normal_7,
    //         BigWinType.normal_8,
    //         BigWinType.normal_9,
    //         BigWinType.normal_10,
    //         BigWinType.normal_11,
    //         BigWinType.normal_12,
    //         BigWinType.normal_13,
    //         BigWinType.normal_14,
    //         BigWinType.normal_15,
    //         BigWinType.bigWin,
    //         BigWinType.megaWin,
    //         BigWinType.superWin,
    //         BigWinType.jumboWin
    //     ];

    //     this.sceneSetting.winSetting.winRunLeveSE = [
    //         SoundDataMap.SCORING_01,
    //         SoundDataMap.SCORING_02,
    //         SoundDataMap.SCORING_03,
    //         SoundDataMap.SCORING_04,
    //         SoundDataMap.SCORING_05,
    //         SoundDataMap.SCORING_06,
    //         SoundDataMap.SCORING_07,
    //         SoundDataMap.SCORING_08,
    //         SoundDataMap.SCORING_09,
    //         SoundDataMap.SCORING_10,
    //         SoundDataMap.SCORING_11,
    //         SoundDataMap.SCORING_12,
    //         SoundDataMap.SCORING_13,
    //         SoundDataMap.SCORING_14,
    //         SoundDataMap.SCORING_15,
    //         SoundDataMap.SCORING_WIN_01,
    //         SoundDataMap.SCORING_WIN_02
    //     ];

    //     switch (this.language) {
    //         case 'en':
    //             this.sceneSetting.winSetting.winRunLeveSE.push(SoundDataMap.SCORING_WIN_01_EN);
    //             this.sceneSetting.winSetting.winRunLeveSE.push(SoundDataMap.SCORING_WIN_02_EN);
    //             this.sceneSetting.winSetting.winRunLeveSE.push(SoundDataMap.SCORING_WIN_03_EN);
    //             this.sceneSetting.winSetting.winRunLeveSE.push(SoundDataMap.SCORING_WIN_04_EN);
    //             break;
    //         case 'cn':
    //         case 'tw':
    //             this.sceneSetting.winSetting.winRunLeveSE.push(SoundDataMap.SCORING_WIN_03_CN);
    //             this.sceneSetting.winSetting.winRunLeveSE.push(SoundDataMap.SCORING_WIN_04_CN);
    //             break;
    //         case 'th':
    //             this.sceneSetting.winSetting.winRunLeveSE.push(SoundDataMap.SCORING_WIN_03_TH);
    //             this.sceneSetting.winSetting.winRunLeveSE.push(SoundDataMap.SCORING_WIN_04_TH);
    //             break;
    //     }

    //     this.sceneSetting.winSetting.runTimeList = [];
    //     for (let i = 0; i < this.sceneSetting.winSetting.winRunLeveSE.length; i++) {
    //         // TODO: 抓贏分音效長度
    //         runTime = 0.5; /* this.soundProxy.getSoundDuration(this.sceneSetting.winSetting.winRunLeveSE[i]); */
    //         if (typeof runTime == 'number') {
    //             this.sceneSetting.winSetting.runTimeList.push(runTime);
    //         } else {
    //             success = false;
    //             return success;
    //         }
    //     }
    //     return success;
    // }

    // ============================ Member ============================
    /** 取得 init 設定資料 */
    public get initEventData(): InitEvent {
        return this._gameData.initEventData;
    }
    public set initEventData(_val: InitEvent) {
        this._gameData.initEventData = _val;
    }

    /** 取得 userSetting */
    public get userSetting(): UserSetting {
        return this._userSetting;
    }
    public set userSetting(_val: UserSetting) {
        this._userSetting = _val;
    }

    /** 取得 commonSetting */
    public get commonSetting(): CommonSetting {
        return this._commonSetting;
    }
    public set commonSetting(_val: CommonSetting) {
        this._commonSetting = _val;
    }

    /** 取得 spin 設定資料 */
    public get spinEventData(): SpinResult {
        return this._gameData.spinEventData;
    }
    public set spinEventData(_val: SpinResult) {
        this._gameData.spinEventData = _val;
    }

    /** 取得 Spin 序號 */
    public get spinSequenceNumber(): number {
        return this._gameData.spinSequenceNumber;
    }
    public set spinSequenceNumber(_val: number) {
        this._gameData.spinSequenceNumber = _val;
    }

    /** 當前數學遊戲狀態資料 */
    public get curStateResult(): GameStateResult {
        return this._gameData.curStateResult;
    }
    public set curStateResult(_val: GameStateResult) {
        this._gameData.curStateResult = _val;
    }

    /** 當前回合表演資料 */
    public get curRoundResult(): CommonGameResult {
        return this._gameData.curRoundResult;
    }
    public set curRoundResult(_val: CommonGameResult) {
        this._gameData.curRoundResult = _val;
    }

    /** 斷線前數學遊戲狀態資料 */
    public get reStateResult(): RecoveryData {
        return this._gameData.recoveryState;
    }
    public set reStateResult(_val: RecoveryData) {
        this._gameData.recoveryState = _val;
    }
    /** Mini Game點擊金幣紀錄資料 */
    public get reSymbolClickedList(): number[] {
        return this._gameData.recoveryState.symbolClickedList;
    }
    public set reSymbolClickedList(_val: number[]) {
        this._gameData.recoveryState.symbolClickedList = _val;
    }

    /** 預設贏分模式 */
    public get initHitPattern(): GameHitPattern {
        return this._gameData.initHitPattern;
    }
    public set initHitPattern(_val: GameHitPattern) {
        this._gameData.initHitPattern = _val;
    }

    /** 觸發 Jackpot */
    public get onHitJackpot(): boolean {
        return this._gameData.onHitJackpot;
    }
    public set onHitJackpot(_val: boolean) {
        this._gameData.onHitJackpot = _val;
    }

    /** 是否可以更新 Jackpot Pool */
    public get canUpdateJackpotPool(): boolean {
        return this._gameData.canUpdateJackpotPool;
    }
    public set canUpdateJackpotPool(_val: boolean) {
        this._gameData.canUpdateJackpotPool = _val;
    }

    /** 拉中 Jackpot 類型為 Grand or Major */
    public get hitJackpotPoolType(): number {
        return this._gameData.hitJackpotPoolType;
    }
    public set hitJackpotPoolType(_val: number) {
        this._gameData.hitJackpotPoolType = _val;
    }

    /** Jackpot 資料 */
    public get jackpotData(): JackpotEvent[] {
        return this._gameData.jackpotData;
    }
    public set jackpotData(_val: JackpotEvent[]) {
        this._gameData.jackpotData = _val;
    }

    /** 彩金 */
    public get credit(): number {
        return this._gameData.credit;
    }
    public set credit(_val: number) {
        this._gameData.credit = _val;
    }

    public get tempWonCredit(): number {
        return this._tempWonCredit;
    }

    public set tempWonCredit(_val: number) {
        this._tempWonCredit = _val;
        this._cash = MathUtil.sub(this.realCash, this._tempWonCredit);
    }

    public resetTempWonCredit() {
        this.tempWonCredit = 0;
    }

    /** 總贏得彩金 */
    public get playerTotalWin(): number {
        return this._gameData.playerTotalWin;
    }
    public set playerTotalWin(_val: number) {
        this._gameData.playerTotalWin = _val;
    }

    /** 滾分結束 */
    public get rollingMoneyEnd(): boolean {
        return this._gameData.rollingMoneyEnd;
    }
    public set rollingMoneyEnd(_val: boolean) {
        this._gameData.rollingMoneyEnd = _val;
    }

    /** 贏分組合演過一次 */
    public get showWinOnceComplete(): boolean {
        return this._gameData.showWinOnceComplete;
    }
    public set showWinOnceComplete(_val: boolean) {
        this._gameData.showWinOnceComplete = _val;
    }

    /** 是否為自動模式 */
    public get onAutoPlay(): boolean {
        return this._gameData.onAutoPlay;
    }
    public set onAutoPlay(_val: boolean) {
        this._gameData.onAutoPlay = _val;
    }

    /** 自動模式 - 目前次數 */
    public get curAutoTimes(): number {
        return this._gameData.curAutoTimes;
    }
    public set curAutoTimes(_val: number) {
        this._gameData.curAutoTimes = _val;
    }

    /** 自動模式 - 最大次數 */
    public get maxAutoTimes(): number {
        return this._gameData.maxAutoTimes;
    }
    public set maxAutoTimes(_val: number) {
        this._gameData.maxAutoTimes = _val;
    }

    /** 紀錄BaseGame的TurboMode狀態 */
    public get curTurboMode(): boolean {
        return this._gameData.curTurboMode;
    }
    public set curTurboMode(_val: boolean) {
        this._gameData.curTurboMode = _val;
    }

    /** 判斷是否要顯示TurboModeMsg */
    public get isShowTurboModeMsg(): boolean {
        return this._gameData.isShowTurboModeMsg;
    }
    public set isShowTurboModeMsg(_val: boolean) {
        this._gameData.isShowTurboModeMsg = _val;
    }

    /** 玩家選擇的遊戲狀態operation - GameOperation(Enum String) */
    public get curGameOperation(): string {
        return this._gameData.curGameOperation;
    }
    public set curGameOperation(_val: string) {
        this._gameData.curGameOperation = _val;
    }

    /** 滾分中 */
    public get scrollingWinLabel(): boolean {
        return this._gameData.scrollingWinLabel;
    }
    public set scrollingWinLabel(_val: boolean) {
        this._gameData.scrollingWinLabel = _val;
    }

    /** 是否可以觸發滾分急停了 */
    public get scrollingWinLabelCanSkip(): boolean {
        return this._gameData.scrollingWinLabelCanSkip;
    }

    public set scrollingWinLabelCanSkip(_val: boolean) {
        this._gameData.scrollingWinLabelCanSkip = _val;
    }

    /** ScrollingEnd是否播放了 */
    public get scrollingEndPlayed(): boolean {
        return this._gameData.scrollingEndPlayed;
    }

    public set scrollingEndPlayed(_val: boolean) {
        this._gameData.scrollingEndPlayed = _val;
    }

    /** 分批載入進度 */
    public get batchSceneComplete(): number {
        return this._gameData.batchSceneComplete;
    }
    public set batchSceneComplete(_val: number) {
        this._gameData.batchSceneComplete = _val;
    }

    /** 投注組合單位 */
    public get betCombinationKeys(): string[] {
        return this._gameData.betCombinationKeys;
    }
    public set betCombinationKeys(_val: string[]) {
        this._gameData.betCombinationKeys = _val;
    }

    /** 投注組合列表 */
    public get totalBetList(): number[] {
        return this._gameData.totalBetList;
    }
    public set totalBetList(_val: number[]) {
        this._gameData.totalBetList = _val;
    }

    /** Jackpot投注所有列表 */
    public get jackpotAllBetList(): number[] {
        return this._gameData.jackpotAllBetList;
    }
    public set jackpotAllBetList(_val: number[]) {
        this._gameData.jackpotAllBetList = _val;
    }

    /** 投注組合index */
    public get totalBetIdx(): number {
        return this._gameData.totalBetIdx;
    }
    public set totalBetIdx(_val: number) {
        this._gameData.totalBetIdx = _val;
    }

    /** 選擇哪個feature */
    public get featureMode(): number {
        return this._gameData.featureMode;
    }
    public set featureMode(_val: number) {
        this._gameData.featureMode = _val;
    }

    /** 遊戲屬於哪種BetType */
    public get gameModule(): GameModule {
        return this._gameData.gameModule;
    }
    public set gameModule(_val: GameModule) {
        this._gameData.gameModule = _val;
    }

    /** 是否大獎直接滾停*/
    public get isBingWinForceComplete(): boolean {
        return true;
    }

    /** 分級贏分面板狀態 */
    public get winBoardState(): WinBoardState {
        return this._gameData.winBoardState;
    }
    public set winBoardState(_val: WinBoardState) {
        this._gameData.winBoardState = _val;
    }
    /**檢查winBoard是否表演中 */
    // public set winBoardShowing(val: boolean) {
    //     this._gameData.winBoardShowing = val;
    // }

    // public get winBoardShowing(): boolean {
    //     return this._gameData.winBoardShowing;
    // }

    /** 目前場景資料 */
    public get curScene(): string {
        return this._gameData.curScene;
    }
    public set curScene(_val: string) {
        this._gameData.curScene = _val;
    }

    /** 前場景資料 */
    public get preScene(): string {
        return this._gameData.preScene;
    }
    public set preScene(_val: string) {
        this._gameData.preScene = _val;
    }

    /** 是否為 Free game結束 */
    public get afterGame2(): boolean {
        return this._gameData.afterGame2;
    }
    public set afterGame2(_val: boolean) {
        this._gameData.afterGame2 = _val;
    }

    /** 全贏線資料 */
    public get curWinData(): AllWinData {
        return this._gameData.curWindData;
    }
    public set curWinData(_val: AllWinData) {
        this._gameData.curWindData = _val;
    }

    /** 狀態贏線資料 */
    public get stateWinData(): AllWinData {
        return this._gameData.stateWinData;
    }
    public set stateWinData(_val: AllWinData) {
        this._gameData.stateWinData = _val;
    }

    /** 最大押分的列表長度 */
    public get maxTotalBetLength(): number {
        return this._gameData.maxTotalBetLength;
    }
    public set maxTotalBetLength(_val: number) {
        this._gameData.maxTotalBetLength = _val;
    }

    /** 是否為報表模式 */
    public get isReportMode(): boolean {
        return this._gameData.isReportMode;
    }
    public set isReportMode(_val: boolean) {
        this._gameData.isReportMode = _val;
    }

    protected _symbolMatchInfo: SymbolMatchInfo;
    public get symbolMatchInfo(): SymbolMatchInfo {
        const self = this;
        if (!self._symbolMatchInfo) self._symbolMatchInfo = new SymbolMatchInfo();
        return self._symbolMatchInfo;
    }

    protected _curHitPattern: GameHitPattern = null;
    /** 當前贏分模式 */
    public set curHitPattern(val: GameHitPattern) {
        this._curHitPattern = val;
        switch (+GameHitPattern[this._curHitPattern]) {
            case GameHitPattern.LeftToRight:
            case GameHitPattern.RightToLeft:
            case GameHitPattern.DoubleHit:
                this.gameModule = GameModule.LineGame;
                break;
        }
    }
    public get curHitPattern(): GameHitPattern {
        return this._curHitPattern;
    }

    /** 投注 */
    public set curBet(val) {
        this._gameData.curBet = val;
        this.betCombinationKeys[1] = '' + val;
        this.saveUserSetting();
    }
    public get curBet(): number {
        return this._gameData.curBet;
    }

    protected _curLine: number = NaN;
    /** 線數 */
    public set curLine(val) {
        this._curLine = val;
        this.betCombinationKeys[2] = '' + val;
    }
    public get curLine(): number {
        return this._curLine;
    }

    protected _curDenom: number = NaN;
    /** 面額 */
    public set curDenom(val) {
        this._curDenom = val;
        this.betCombinationKeys[0] = '' + MathUtil.mul(val, 1000);
        let denom = MathUtil.mul(this.curDenom, 0.001);
        this.credit = MathUtil.div(this.cash, denom);

        const webBridgeProxy = this.facade.retrieveProxy(WebBridgeProxy.NAME) as WebBridgeProxy;
        webBridgeProxy.updateHtmlCredit();
        this.saveUserSetting();
    }
    public get curDenom(): number {
        return MathUtil.mul(this._curDenom, 1000); // DefaultSettingCommand 有先將 Denom 除 100 方便表演，真正使用時，需乘回來.
    }

    /** 額外投注 */
    public set curExtraBet(val) {
        this._gameData.curExtraBet = val;
        this.betCombinationKeys[3] = '' + val;
        this.saveUserSetting();
    }
    public get curExtraBet(): string {
        return this._gameData.curExtraBet;
    }

    /** 投注組合取得的值 */
    public set curTotalBet(val) {
        this._gameData.curTotalBet = val;
    }
    public get curTotalBet(): number {
        return this._gameData.curTotalBet;
    }

    /**FG=>BG 總贏分的倍率*/
    public get totalWinAmount(): number {
        return this._gameData.totalWinAmount;
    }

    public set totalWinAmount(val) {
        this._gameData.totalWinAmount = val;
    }

    /**FG=>BG 滾分時間 ms */
    public set totalScoringTime(value: number) {
        this._gameData.totalScoringTime = value;
    }
    public get totalScoringTime(): number {
        return this._gameData.totalScoringTime;
    }

    /**FG=>BG 獎項類別 ms */
    public set totalWinType(value: WinType) {
        this._gameData.totalWinType = value;
    }
    public get totalWinType(): WinType {
        return this._gameData.totalWinType;
    }

    /**聲音開關狀態 */
    public set soundEnableState(value: boolean) {
        this._gameData.soundEnableState = value;
    }

    public get soundEnableState(): boolean {
        return this._gameData.soundEnableState;
    }

    // 取得傳入 GS 所需的 Bet 值
    public get curBetByCombination(): number {
        return this.initEventData.singleBetCombinations[this.curBetCombinationKey];
    }

    /** 取得投注組合 Key 值 */
    public get curBetCombinationKey(): string {
        return (
            this.betCombinationKeys[0] +
            '_' +
            this.betCombinationKeys[1] +
            '_' +
            this.betCombinationKeys[2] +
            '_' +
            this.betCombinationKeys[3]
        );
    }

    /** 判斷是否可以spin */
    public get readySpin(): boolean {
        return this._gameData.readySpin;
    }
    public set readySpin(v: boolean) {
        this._gameData.readySpin = v;
    }

    /** 判斷是否spin中 */
    public get isSpinning(): boolean {
        return this._gameData.isSpinning;
    }
    public set isSpinning(v: boolean) {
        this._gameData.isSpinning = v;
    }

    /** 判斷是否可以spin */
    public get isIdleReminding(): boolean {
        return this._gameData.isIdleReminding;
    }
    public set isIdleReminding(v: boolean) {
        this._gameData.isIdleReminding = v;
    }

    private _orientationEvent: string;
    /** 接收到的orientation事件*/
    public get orientationEvent(): string {
        return this._orientationEvent;
    }
    public set orientationEvent(v: string) {
        this._orientationEvent = v;
    }

    /** 預設的ExtraBetIndex */
    public get defaultExtraBetIndex(): number {
        return 0;
    }

    /** 接收到的Fortune Level數值 */
    private _fortuneLevel: string;
    public get lastFortuneLevel(): string {
        return this._fortuneLevel;
    }
    public set lastFortuneLevel(v: string) {
        this._fortuneLevel = v;
    }

    /** 是否有收到 Feature selection 的結果 */
    public get hasSelectionResponse(): boolean {
        return this._gameData.hasSelectionResponse;
    }
    public set hasSelectionResponse(_val: boolean) {
        this._gameData.hasSelectionResponse = _val;
    }
    // ============================ Method ============================

    /** 現金 */
    protected _cash: number = NaN;

    public realCash: number = 0;
    public _tempWonCredit: number = 0;

    /**
     * 這邊給changeBalance塞資料用
     * @author
     */
    public setBmd(value: number, isBalance: boolean = false) {
        this.realCash = value;
        this._cash = MathUtil.sub(this.realCash, this._tempWonCredit);
        let denom = MathUtil.mul(this.curDenom, 0.001);
        this.credit = MathUtil.div(this._cash, denom);
    }

    public get cash(): number {
        return this._cash;
    }

    protected _runWinComplete: boolean = false;
    public set runWinComplete(val: boolean) {
        this._runWinComplete = val;
    }
    /** 滾分完成 */
    public get runWinComplete(): boolean {
        return this._runWinComplete;
    }

    //檢查 credit 足不足夠一把
    public checkCreditEnough(): boolean {
        //針對Recovery流程處理
        if (this.reStateResult != null) {
            return true;
        }
        //正常流程
        if (this.curScene != GameScene.Game_1 || this.onFreePlay == true) {
            return true;
        } else {
            let balance: number = MathUtil.sub(this.cash, this.curTotalBet);
            if (balance < 0) {
                Logger.i('餘額不足');
                this.networkProxy.sendNotEnoughMsg();
                return false;
            } else {
                this.setBmd(balance);
                return true;
            }
        }
    }

    /**
     * 確認reel可以spin
     */
    public checkReelCanSpin(): boolean {
        if (
            (this.gameState == StateMachineProxy.GAME1_IDLE ||
                this.gameState == StateMachineProxy.GAME2_IDLE ||
                this.gameState == StateMachineProxy.GAME4_IDLE) &&
            this.checkCreditEnough()
        )
            return true;
        return false;
    }
    //  ============= [Method 相關] =============
    /**
     * Credit 透過 curDenom 轉換為 Cash
     * @param _data - 值
     */
    public convertCredit2Cash(_data: number): number {
        return MathUtil.mul(_data, this.curDenom, 0.001);
    }

    /** 載入玩家該遊戲使用的 denom、bet */
    public loadUserSetting(): void {
        try {
            if (window.localStorage) this.userSetting = JSON.parse(localStorage.getItem(this.localStorageKey));
        } catch (e) {
            let userData: UserSetting = new UserSetting();
            userData.denom = `${this.initEventData.denoms[0]}`;
            this.userSetting = userData;
        }
    }

    /** 儲存玩家使用習慣 */
    protected saveUserSetting(): void {
        let saveData: UserSetting = new UserSetting();
        saveData.denom = this.betCombinationKeys[0];
        saveData.bet = this.betCombinationKeys[1];
        saveData.line = this.betCombinationKeys[2];
        saveData.extrabet = this.betCombinationKeys[3];
        try {
            if (window.localStorage) localStorage.setItem(this.localStorageKey, JSON.stringify(saveData));
        } catch (e) {}
    }

    /**
     * [HTML to GAME]
     * - 網頁端選擇 TotalBet，遊戲設定所選的值.
     * @param _value User 所選值
     */
    public resetBetInfo(_value: number, _init: boolean = false): any {
        let _key: string = '';
        let _param: string[] = [];
        let _tempBet: number = NaN;
        let _exist: boolean = false;
        let _returnObj: any = new Object();
        for (_key in this.initEventData.singleBetCombinations) {
            let _isExtraBetMatch = true;
            if (this.curExtraBet) {
                _isExtraBetMatch = _key.indexOf(this.curExtraBet) !== -1;
            }
            _param = _key.split('_');
            _tempBet = MathUtil.mul(+this.initEventData.singleBetCombinations[_key], +_param[0], 0.001);
            if (_tempBet == _value && _isExtraBetMatch) {
                _exist = true;
                _returnObj.totalBet = _tempBet;
                this.curDenom = _returnObj.denom = MathUtil.mul(+_param[0], 0.001);
                this.curBet = _returnObj.bet = +_param[1];
                this.curLine = +_param[2];
                this.curExtraBet = _param.length < 5 ? _param[3] : _param[3] + '_' + _param[4];
                break;
            }
        }

        if (_exist) {
            // 設定 TotalBet
            this.curTotalBet = _value;
            this.networkProxy.updateTotalBet(this.curTotalBet);

            return _returnObj;
        } else {
            Logger.w('投注組合不存在目前設定的投注數字 : ' + _value);
            return undefined;
        }
    }

    // /** 確認autoplay下是否中大獎 */
    // public isAutoPlayBigWin(): boolean {
    //     return this.onAutoPlay && this.curScene === GameScene.Game_1 && this.isGradeWin();
    // }

    // /** 大獎面板後 秀線判斷 */
    // public afterGradeWinBoardShow(): boolean {
    //     return this.curScene === GameScene.Game_1 && this.isGradeWin();
    // }

    // /** 確認是否為GradeWin的狀態 */
    // public isGradeWin(): boolean {
    //     return (
    //         !!this.spinEventData &&
    //         !!this.spinEventData.baseGameResult &&
    //         !!this.spinEventData.baseGameResult.displayInfo &&
    //         BigWinType[this.spinEventData.baseGameResult.displayInfo.bigWinType] >= BigWinType.bigWin
    //     );
    // }

    // /** 確認是否為NormalWin的狀態 */
    // public isNormalWin(): boolean {
    //     return (
    //         !!this.spinEventData &&
    //         !!this.spinEventData.baseGameResult &&
    //         !!this.spinEventData.baseGameResult.displayInfo &&
    //         BigWinType[this.spinEventData.baseGameResult.displayInfo.bigWinType] <= BigWinType.normal_15
    //     );
    // }

    /** 重置遊戲參數 */
    public resetGameParams() {
        const self = this;
        self.curStateResult = null;
        self.curRoundResult = null;
        self.curHitPattern = self.initHitPattern;
        self.curWinData.dispose();
    }

    /**
     * 根據數學id取得對應的frame資料
     * */
    public getCurrentReelSymbolIDIndexByID(stripId: number): number {
        const self = this;
        if (!self._sceneSetting) return -1;
        const gameSceneData = self._sceneSetting.getGameSceneDataByName(self.curScene);
        if (!gameSceneData) return -1;
        const index = gameSceneData.reelSymbolFrameByIDs.indexOf(stripId);
        return index;
    }

    /** 是否這場資料有特殊表演 */
    public isHitSpecial(): boolean {
        const self = this;
        if (!self.curRoundResult) return false;
        if (!self.curRoundResult.specialFeatureResult) return false;
        if (self.curRoundResult.specialFeatureResult.length > 0) {
            for (let i = 0; i < self.curRoundResult.specialFeatureResult.length; i++) {
                if (
                    self.curRoundResult.specialFeatureResult[i].specialHitInfo !=
                    SpecialHitInfo[SpecialHitInfo.noSpecialHit]
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    /** 是否這場資料有中 Grand */
    public isHitGrand(): boolean {
        const self = this;
        let isHitGrand = false;
        const hasBonus02 = (result: SpecialFeatureResult) =>
            result.specialHitInfo === SpecialHitInfo[SpecialHitInfo.bonusGame_02];
        isHitGrand = self?.curRoundResult?.specialFeatureResult.some(hasBonus02);
        return isHitGrand ? isHitGrand : false;
    }

    /** 是否資料有 Feature selection */
    public hasFeatureSelection(): boolean {
        const self = this;
        let hasFeatureSelection = false;
        const hasWaitForClient = (result: SpecialFeatureResult) =>
            result.specialHitInfo === SpecialHitInfo[SpecialHitInfo.waitingForClient];
        hasFeatureSelection = self?.spinEventData?.baseGameResult?.specialFeatureResult.some(hasWaitForClient);
        return hasFeatureSelection ? hasFeatureSelection : false;
    }

    /** 設定押注列表 */
    public setTotalBetList(): void {
        const self = this;
        const extraBetTypeList = self.initEventData.executeSetting.baseGameSetting.betSpec.extraBetTypeList;
        // 投注組合是否包含 extraBet
        if (extraBetTypeList.length > 1) {
            if (!self.curExtraBet) {
                if (self.userSetting && self.userSetting.extrabet) {
                    self.curExtraBet = self.userSetting.extrabet;
                } else {
                    self.curExtraBet = extraBetTypeList[self.defaultExtraBetIndex].toString();
                }
            }
            const tempCurExtraBet = self.curExtraBet;
            const maxExtraBetType = extraBetTypeList[extraBetTypeList.length - 1].toString();
            self.initBetCombinations();
            // 取得最大額外押分 Bet 列表長度
            self.curExtraBet = maxExtraBetType;
            self.setTotalBetExtraBet();
            self.maxTotalBetLength = self.totalBetList.length;
            // 設定當前的 totalBetList
            self.curExtraBet = tempCurExtraBet;
            self.setTotalBetExtraBet();
        } else {
            self.setTotalBetNoExtraBet();
        }
    }

    protected setTotalBetNoExtraBet(): void {
        const self = this;
        // 整理 singleBetCombinations 的投注組合依大到小排列
        let _tempKey: string = '';
        let _denom: number = NaN;
        let _maxBet = MathUtil.div(+self.initEventData.maxBet, 1000);
        let _totalBet: number = NaN;
        // 加入初始化重設totalBetList
        self.totalBetList = [];
        for (_tempKey in self.initEventData.singleBetCombinations) {
            _denom = +_tempKey.split('_')[0];
            _totalBet = MathUtil.mul(+self.initEventData.singleBetCombinations[_tempKey], MathUtil.div(_denom, 1000));

            // 押分超過最大押分 不加入TotalBetList
            // if (_totalBet > _maxBet) continue;

            self.totalBetList.push(_totalBet);
        }
        self.totalBetList.sort(function (a, b) {
            return a - b;
        });
        self.totalBetList.reverse();
    }

    protected setTotalBetExtraBet(): void {
        // 整理 singleBetCombinations 的投注組合依大到小排列
        let _tempKey: string = '';
        let _denom: number = NaN;
        let _maxBet = MathUtil.div(+this.initEventData.maxBet, 1000);
        let _totalBet: number = NaN;
        // 加入初始化重設totalBetList
        this.totalBetList = [];
        // 改寫 singleBetCombinations 用betCombinations的投注組合依大到小排列
        for (_tempKey in this.initEventData.singleBetCombinations) {
            if (_tempKey.indexOf(this.curExtraBet) !== -1) {
                _denom = +_tempKey.split('_')[0];
                _totalBet = MathUtil.mul(
                    +this.initEventData.singleBetCombinations[_tempKey],
                    MathUtil.div(_denom, 1000)
                );

                // 押分超過最大押分 不加入TotalBetList
                // if (_totalBet > _maxBet) continue;

                this.totalBetList.push(
                    MathUtil.mul(+this.initEventData.singleBetCombinations[_tempKey], MathUtil.div(_denom, 1000))
                );
            }
        }
        this.totalBetList.sort(function (a, b) {
            return a - b;
        });
        this.totalBetList.reverse();

        // 移除重複值
        this.totalBetList = this.totalBetList.filter(function (el, i, arr) {
            return arr.indexOf(el) === i;
        });

        // 整理長度 (讓所有 ExtraBet 的長度一致)
        if (this.totalBetList.length > this.maxTotalBetLength) {
            const diff = this.totalBetList.length - this.maxTotalBetLength;
            this.totalBetList = this.totalBetList.slice(diff, this.totalBetList.length);
        }
    }

    protected initBetCombinations() {
        let _tmpVal: string,
            _tmpParam: string[],
            _newKey: string,
            _newCombinations: { [key: string]: number } = {};
        for (let key in this.initEventData.betCombinations) {
            _tmpVal = key.toString();
            _tmpParam = _tmpVal.split('_');

            let i: number = 0;
            while (i < this.initEventData.denoms.length) {
                _newKey = this.initEventData.denoms[i] + '_' + _tmpVal;
                _newCombinations[_newKey] = this.initEventData.betCombinations[key];
                i++;
            }
        }

        this.initEventData.singleBetCombinations = _newCombinations;
    }

    public getJackpotPoolRangeIndexWithBet(): number {
        const jpPoolData = this.initEventData.executeSetting.jackpotSetting.jackpotPoolData[0];
        const wayBetList = this.initEventData.executeSetting.baseGameSetting.betSpec.waysBetList;
        const curBetIndex = wayBetList.findIndex((bet) => bet == this.curBet);
        const betRangeMapIndex = jpPoolData.jackpotExtendSetting.betRangeMap[curBetIndex];

        return betRangeMapIndex;
    }

    /** 是否為 Free Play 模式 */
    public get onFreePlay(): boolean {
        return this._gameData.onFreePlay;
    }
    public set onFreePlay(_val: boolean) {
        this._gameData.onFreePlay = _val;
    }

    protected _networkProxy: NetworkProxy;
    protected get networkProxy(): NetworkProxy {
        if (!this._networkProxy) {
            this._networkProxy = this.facade.retrieveProxy(NetworkProxy.NAME) as NetworkProxy;
        }
        return this._networkProxy;
    }
}
