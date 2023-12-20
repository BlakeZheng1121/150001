import { Vec3, Node } from 'cc';
import { AudioClipsEnum } from '../../game/vo/enum/SoundMap';
import { ReelEvent, ReelDataProxyEvent } from '../util/Constant';
import { UISymbol } from '../view/reel/symbol/UISymbol';
import { WheelData } from '../vo/data/WheelData';
import { LockType, SymbolPartType } from '../vo/enum/Reel';
import { WheelUsePattern } from '../vo/enum/WheelUsePattern';
import { GameStateSetting } from '../vo/setting/GameStateSetting';
import { GameDataProxy } from './GameDataProxy';
import { ReelState } from '../vo/data/ReelState';

export class ReelDataProxy extends puremvc.Proxy {
    public static NAME: string = 'ReelDataProxy';
    public reelStopSoundSequence: Array<Array<AudioClipsEnum>> | null = [];
    public symbolFeature: Array<Array<SymbolPosData>> | null = null; //Symbol上 Feature資料

    public runtimeStrip: number[][] = []; // Runtime Strip, 專門用來讓滾動的滾輪做效果使用
    public isSlowMotionAry: boolean[] = []; // 滾輪瞇牌資訊
    public reelState: ReelState = ReelState.None;

    protected symbolsNode: Array<Array<Node>> = []; //Symbol上 Node資料
    protected reelTable: WheelData[] = [];
    protected tempStateSetting: GameStateSetting = null;
    protected reelCounts: number = 0;
    protected _rollingStripMap: Map<string, Array<Array<number>>>;

    public constructor() {
        super(ReelDataProxy.NAME);
        this._rollingStripMap = new Map<string, Array<Array<number>>>();
    }

    protected _isTurboMode: boolean = false;
    /** 加速模式 */
    public set isTurboMode(val: boolean) {
        this._isTurboMode = val;
        this.sendNotification(ReelEvent.ON_TURBO_STATE_CHANGE);
    }

    public get isTurboMode(): boolean {
        return this._isTurboMode;
    }

    protected _mathTableIndex: number = 0;
    /** 數學使用輪帶表的索引值 */
    public set mathTableIndex(index: number) {
        this._mathTableIndex = index;
        this.refreshMathTable();
    }
    public get mathTableIndex(): number {
        return this._mathTableIndex;
    }

    public get isHasNewLock(): boolean {
        for (let i = 0; i < this.symbolFeature.length; i++) {
            for (let j = 0; j < this.symbolFeature[i].length; j++) {
                if (this.symbolFeature[i][j].lockType == LockType.NEW_LOCK) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 初始化不同場景的輪帶表
     * @param sceneName 場景名稱
     * @param strip 輪帶表
     */
    public setRollingStrip(sceneName: string, strip: Array<Array<number>>) {
        this._rollingStripMap.set(sceneName, strip);
    }

    /**
     * 取得當前場景的輪帶表
     */
    public get rollingStrip(): Array<Array<number>> {
        return this._rollingStripMap.get(this.gameDataProxy.curScene);
    }

    /** 更新輪帶表 */
    protected refreshMathTable() {
        let curSceneName: string = this.gameDataProxy.curScene;
        let reelIdx: number = 0;

        this.tempStateSetting = this.gameDataProxy.getStateSettingById(curSceneName);
        this.reelTable = this.tempStateSetting.wheelData[this.mathTableIndex];

        // 是否為獨立輪
        if (this.tempStateSetting.wheelUsePattern == WheelUsePattern[WheelUsePattern.Independent]) {
            this.reelCounts = this.tempStateSetting.screenColumn * this.tempStateSetting.screenRow;
        } else {
            this.reelCounts = this.tempStateSetting.screenColumn;
        }

        // 更新輪帶表
        for (reelIdx = 0; reelIdx < this.reelCounts; reelIdx++) {
            this.rollingStrip[reelIdx] = this.reelTable[reelIdx].wheelData;
        }

        this.sendNotification(ReelDataProxyEvent.ON_STRIP_CHANGE);
    }

    public getFovPos(reelIndex: number, fovIndex: number): Vec3 {
        this.symbolsNode.forEach((symbols) => {
            symbols.sort(this.positionCompare);
        });
        //return this.symbolsNode[reelIndex][fovIndex + 1].worldPosition;
        return this.symbolsNode[reelIndex][fovIndex + 1].getComponent(UISymbol).getSymbolPosWithType(SymbolPartType.LABEL);
    }

    public setSymbolsNode(symbols: Array<Array<Node>>) {
        this.symbolsNode = symbols;
    }

    /** 還原設定 */
    public reset() {
        this.isSlowMotionAry = [];
    }

    // ======================== Get Set ========================
    protected _gameDataProxy: GameDataProxy;
    protected get gameDataProxy(): GameDataProxy {
        if (this._gameDataProxy == null) {
            this._gameDataProxy = this.facade.retrieveProxy(GameDataProxy.NAME) as GameDataProxy;
        }
        return this._gameDataProxy;
    }

    protected positionCompare(s1: Node, s2: Node) {
        if (s1.worldPosition.y < s2.worldPosition.y) {
            return 1;
        } else if (s1.worldPosition.y > s2.worldPosition.y) {
            return -1;
        }
        return 0;
    }
}

export class SymbolPosData {
    /** 分數球上 金額 */
    public creditCent: number = 0;
    /** 分數球上 %數 or 倍數 */
    public multiple: number = 0;
    /** 此位置擁有加場次次數 */
    public ReSpinNum: number = 0;
    /** 此位置是否擁有鑲嵌Scatter */
    public hasScatter: boolean = false;
    /** 此位置是否是特別球 EX: 10倍球 */
    public isSpecial: boolean = false;
    /** Lock類別 */
    public lockType: LockType = LockType.NONE;
    /** 語系的判斷 */
    public language: string = '';

    /** 複製內容 */
    public concat(): SymbolPosData {
        let _symbolPosData = new SymbolPosData();
        _symbolPosData.creditCent = this.creditCent;
        _symbolPosData.multiple = this.multiple;
        _symbolPosData.ReSpinNum = this.ReSpinNum;
        _symbolPosData.hasScatter = this.hasScatter;
        _symbolPosData.lockType = this.lockType;
        _symbolPosData.isSpecial = this.isSpecial;
        _symbolPosData.language = this.language;
        return _symbolPosData;
    }
}
