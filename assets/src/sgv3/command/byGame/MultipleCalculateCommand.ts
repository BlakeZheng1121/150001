import { _decorator, Component, Node } from 'cc';
import { BaseScoringDuration } from '../../../game/vo/enum/SoundMap';
import { GameDataProxy } from '../../proxy/GameDataProxy';
import { FreeGameEvent } from '../../util/Constant';
import { WinType } from '../../vo/enum/WinType';
import { DisplayInfo } from '../../vo/info/DisplayInfo';
import { BaseGameResult } from '../../vo/result/BaseGameResult';
import { CommonGameResult } from '../../vo/result/CommonGameResult';
import { GameStateResult } from '../../vo/result/GameStateResult';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MultipleCalculateCommand
 * DateTime = Wed Feb 09 2022 10:15:35 GMT+0800 (台北標準時間)
 * Author = aryanaqq
 * FileBasename = MultipleCalculateCommand.ts
 * FileBasenameNoExtension = MultipleCalculateCommand
 * URL = db://assets/src/sgv3/command/byGame/MultipleCalculateCommand.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('MultipleCalculateCommand')
export class MultipleCalculateCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = FreeGameEvent.ON_CALCULATE_MULTIPLE;
    public execute(notification: puremvc.INotification): void {
        this.multipleSet();
    }

    protected multipleSet() {
        this.gameDataProxy.spinEventData.gameStateResult.forEach((gameStateResult) => {
            //BaseGame
            if (gameStateResult.gameSceneName == 'Game_1') {
                gameStateResult.roundResult.forEach((commonGameResult) => {
                    let playerWin = this.gameDataProxy.convertCredit2Cash(
                        this.gameDataProxy.spinEventData.baseGameResult.baseGameTotalWin
                    );
                    let multiple = playerWin / this.gameDataProxy.curTotalBet;
                    commonGameResult.displayInfo.scoringTime = this.getScoringTime(multiple);
                    commonGameResult.displayInfo.winType = this.getWinType(multiple);
                    // this.gameDataProxy.spinEventData.baseGameResult.displayInfo.bigWinType =
                    //     this.getWinType(multiple);
                });
                let totalWinAmount = this.gameDataProxy.convertCredit2Cash(this.gameDataProxy.spinEventData.playerTotalWin);
                let totalMultiple = totalWinAmount / this.gameDataProxy.curTotalBet;
                this.gameDataProxy.totalWinAmount = totalWinAmount;
                this.gameDataProxy.totalScoringTime = this.getScoringTime(totalMultiple);
                this.gameDataProxy.totalWinType = this.getWinType(totalMultiple);
            }
            //FreeGame
            if (gameStateResult.gameSceneName == 'Game_2') {
                let playerWin;
                gameStateResult.roundResult.forEach((commonGameResult) => {
                    playerWin = this.gameDataProxy.convertCredit2Cash(commonGameResult.waysGameResult.playerWin);
                    let multiple = playerWin / this.gameDataProxy.curTotalBet;
                    commonGameResult.displayInfo.scoringTime = this.getScoringTime(multiple);
                    commonGameResult.displayInfo.winType = this.getWinType(multiple);
                });
            }
        });
    }
    protected getWinType(winMultiple: number): WinType {
        let winType: WinType;
        switch (true) {
            case winMultiple > 0 && winMultiple < 1:
                winType = WinType.section_1;
                break;
            case winMultiple >= 1 && winMultiple < 2:
                winType = WinType.section_2;
                break;
            case winMultiple >= 2 && winMultiple < 3:
                winType = WinType.section_3;
                break;
            case winMultiple >= 3 && winMultiple < 4:
                winType = WinType.section_4;
                break;
            case winMultiple >= 4 && winMultiple < 5:
                winType = WinType.section_5;
                break;
            case winMultiple >= 5 && winMultiple < 6:
                winType = WinType.section_6;
                break;
            case winMultiple >= 6 && winMultiple < 7:
                winType = WinType.section_7;
                break;
            case winMultiple >= 7 && winMultiple < 8:
                winType = WinType.section_8;
                break;
            case winMultiple >= 8 && winMultiple < 9:
                winType = WinType.section_9;
                break;
            case winMultiple >= 9 && winMultiple < 10:
                winType = WinType.section_10;
                break;
            case winMultiple >= 10 && winMultiple < 11:
                winType = WinType.section_11;
                break;
            case winMultiple >= 11 && winMultiple < 12:
                winType = WinType.section_12;
                break;
            case winMultiple >= 12 && winMultiple < 13:
                winType = WinType.section_13;
                break;
            case winMultiple >= 13 && winMultiple < 14:
                winType = WinType.section_14;
                break;
            case winMultiple >= 14 && winMultiple < 15:
                winType = WinType.section_15;
                break;
            //BigWin
            case winMultiple >= 15 && winMultiple < 35:
                winType = WinType.bigWin;
                break;
            //MegaWin
            case winMultiple >= 35 && winMultiple < 60:
                winType = WinType.megaWin;
                break;
            //SuperWin
            case winMultiple >= 60 && winMultiple < 100:
                winType = WinType.superWin;
                break;
            //JumboWin
            case winMultiple >= 100:
                winType = WinType.jumboWin;
                break;
            default:
                winType = WinType.none;
                break;
        }
        return winType;
    }

    protected getScoringTime(winMultiple: number): number {
        let scoringTime = 0;
        switch (true) {
            case winMultiple > 0 && winMultiple < 1:
                scoringTime = BaseScoringDuration.Scoring01;
                break;
            case winMultiple >= 1 && winMultiple < 2:
                scoringTime = BaseScoringDuration.Scoring02;
                break;
            case winMultiple >= 2 && winMultiple < 3:
                scoringTime = BaseScoringDuration.Scoring03;
                break;
            case winMultiple >= 3 && winMultiple < 4:
                scoringTime = BaseScoringDuration.Scoring04;
                break;
            case winMultiple >= 4 && winMultiple < 5:
                scoringTime = BaseScoringDuration.Scoring05;
                break;
            case winMultiple >= 5 && winMultiple < 6:
                scoringTime = BaseScoringDuration.Scoring06;
                break;
            case winMultiple >= 6 && winMultiple < 7:
                scoringTime = BaseScoringDuration.Scoring07;
                break;
            case winMultiple >= 7 && winMultiple < 8:
                scoringTime = BaseScoringDuration.Scoring08;
                break;
            case winMultiple >= 8 && winMultiple < 9:
                scoringTime = BaseScoringDuration.Scoring09;
                break;
            case winMultiple >= 9 && winMultiple < 10:
                scoringTime = BaseScoringDuration.Scoring10;
                break;
            case winMultiple >= 10 && winMultiple < 11:
                scoringTime = BaseScoringDuration.Scoring11;
                break;
            case winMultiple >= 11 && winMultiple < 12:
                scoringTime = BaseScoringDuration.Scoring12;
                break;
            case winMultiple >= 12 && winMultiple < 13:
                scoringTime = BaseScoringDuration.Scoring13;
                break;
            case winMultiple >= 13 && winMultiple < 14:
                scoringTime = BaseScoringDuration.Scoring14;
                break;
            case winMultiple >= 14 && winMultiple < 15:
                scoringTime = BaseScoringDuration.Scoring15;
                break;
            //BigWin
            case winMultiple >= 15 && winMultiple < 35:
                scoringTime = BaseScoringDuration.Scoring_Win01;
                break;
            //MegaWin
            case winMultiple >= 35 && winMultiple < 60:
                scoringTime = BaseScoringDuration.Scoring_Win02;
                break;
            //SuperWin
            case winMultiple >= 60 && winMultiple < 100:
                scoringTime = BaseScoringDuration.Scoring_Win03;
                break;
            //JumboWin
            case winMultiple >= 100:
                scoringTime = BaseScoringDuration.Scoring_Win04;
                break;
            default:
                break;
        }
        return scoringTime;
    }

    protected _gameDataProxy: GameDataProxy;
    public get gameDataProxy(): GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GameDataProxy.NAME) as GameDataProxy;
        }
        return this._gameDataProxy;
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
