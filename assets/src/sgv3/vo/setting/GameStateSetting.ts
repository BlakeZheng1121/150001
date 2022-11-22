import { CommonGameSetting } from './CommonGameSetting';

export class GameStateSetting extends CommonGameSetting {
    constructor(baseSetting: CommonGameSetting) {
        super();
        this.screenRow = baseSetting.screenRow;
        this.screenColumn = baseSetting.screenColumn;
        this.wheelUsePattern = baseSetting.wheelUsePattern;
        this.tableCount = baseSetting.tableCount;
        this.tableHitProbability = baseSetting.tableHitProbability;
        this.wheelData = baseSetting.wheelData;
        this.maxBetLine = baseSetting.maxBetLine;
        this.lineTable = baseSetting.lineTable;
        this.gameHitPattern = baseSetting.gameHitPattern;
    }
    /** 遊戲狀態id */
    public gameSceneId: string;
}
