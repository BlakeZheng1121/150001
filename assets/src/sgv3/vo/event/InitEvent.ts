import { SpinResult } from '../result/SpinResult';
import { ExecuteSetting } from '../setting/ExecuteSetting';
import { GameStateSetting } from '../setting/GameStateSetting';

/**
 * 封裝初始化資料
 *
 * @export
 * @class InitEvent
 */
export class InitEvent {
    // executeSetting: ExecuteSetting;

    /**
     * auto play times list
     */
    public autoPlayTimesList: Array<number>;

    /**
     * available denoms
     */
    public denoms: Array<number>;

    /**
     * max time of gambles allowed
     */
    public gambleTimes: number;

    /**
     * max gambling amount (in CENT)
     */
    public gambleLimit: number;

    /**
     * index of default denom, regarding the "denoms" array
     */
    public defaultDenomIdx: number;

    /**
     * index of default bet line selection
     */
    public defaultBetLineIdx: number;

    /**
     * index of default line bet selection
     */
    public defaultLineBetIdx: number;

    /**
     * index of default ways bet column selection
     */
    public defaultWaysBetColumnIdx: number;

    /**
     * index of default ways bet selection
     */
    public defaultWaysBetIdx: number;

    /**
     * all possible bet combination for this user in this game
     * (key: bet_betSubject_extraBetType, ex: "1_50_NoExtraBet": 30)
     */
    public betCombinations: { [key: string]: number };
    public singleBetCombinations: { [key: string]: number };

    /** 紀錄可執行的遊戲設定 */
    public executeSetting: ExecuteSetting;

    /** game feature count */
    public gameFeatureCount: number;

    /** 最大押分 */
    public maxBet: number;

    // For Reconstruct GameStateSetting
    public gameStateSettings: Array<GameStateSetting>;

    /** Recovery紀錄 表演內容 */
    public recoveryData: string;
    public recoveryBalance: number;

    /** 沒有完成 SettlePlay前，會有的資料  */
    public spinResult: SpinResult;
    public gameSeqNo: number;
}
