import { ExtendInfoForBonusGameResult_JHS0001 } from './ExtendInfoForBonusGameResult_JHS0001';
import { PoolHitInfo } from './PoolHitInfo';
export class BonusGameOneRoundResult {
    public specialHitInfo: string; //中哪種BonusGame
    public hitPool: number[];
    public poolamount: number[];
    public oneRoundTotalWinWithoutJP: number;
    public oneRoundJPTotalWin: number;
    public jpHitInfo: PoolHitInfo[];
    public nonJPHitInfo: PoolHitInfo[];
    public extendInfoForBonusGameResult: ExtendInfoForBonusGameResult_JHS0001;
}
