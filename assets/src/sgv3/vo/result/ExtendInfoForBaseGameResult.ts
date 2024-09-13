export class ExtendInfoForBaseGameResult {
    public isPowerUp: boolean;
    public ballCount: number;
    public ballTotalCredit: number;
    public ballScreenLabel: Array<Array<number>>;
    public mysterySymbol: number;
    public extendPlayerWin: number;
    public extendGameFeature: number;
    // rngInfo 備份，避免 Recovery 後，rngInfo 資料遺失的問題
    public backUpRngInfo: Array<Array<number>>;
    public groupingIdx: number; // 紀錄每個Round中，group使用哪一個組合s
    public seatInfo: SeatInfo;
}

export class SeatInfo {
    public statusType: number;
    public statusCount: number;
    public statusAccumulation: Array<number>;
}
