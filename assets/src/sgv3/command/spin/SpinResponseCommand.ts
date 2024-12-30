import { RefactoringGameData } from '../../../core/utils/RefactoringGameData';
import { ChangeBalanceCommand } from '../../../core/command/ChangeBalanceCommand';
import { Logger } from '../../../core/utils/Logger';
import { GameDataProxy } from '../../proxy/GameDataProxy';
import { WebBridgeProxy } from '../../proxy/WebBridgeProxy';
import { SpinGSResult, SpinResult } from '../../vo/result/SpinResult';
import { CheckGameFlowCommand } from '../CheckGameFlowCommand';
import { GameStateId } from '../../vo/data/GameStateId';
import { NetworkProxy } from '../../../core/proxy/NetworkProxy';
import { ByGameHandleCommand } from './ByGameHandleCommand';
import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { MathUtil } from '../../../core/utils/MathUtil';
import { GameSceneOption } from '../../vo/data/GameScene';
import { UIEvent } from 'common-ui/proxy/UIEvent';
import { GTMUtil } from 'src/core/utils/GTMUtil';

/**
 * 接收到Server打過來的資料後進行處理
 */
export class SpinResponseCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = 'h5.spinResponse';

    public execute(notification: puremvc.INotification) {
        Logger.i('[SpinResponseCommand] Execute');
        let notifyObj: SpinGSResult = notification.getBody() as SpinGSResult;
        let gameStateResult = RefactoringGameData.RefactoringGameResult(notifyObj.spinResult);
        this.changeWheelData(notifyObj.spinResult);
        Logger.i(JSON.stringify(notifyObj));
        this.networkProxy.setGameSeqNo(notifyObj.gameSeq);
        this.networkProxy.resetSentSpinRequest();
        this.setEndGameStateId(gameStateResult[gameStateResult.length - 1].gameStateId);

        const self = this;
        self.gameDataProxy.spinSequenceNumber = notifyObj.gameSeq;
        self.gameDataProxy.spinEventData = notifyObj.spinResult;
        self.gameDataProxy.spinEventData.gameStateResult = gameStateResult;
        self.gameDataProxy.playerTotalWin = self.gameDataProxy.convertCredit2Cash(
            self.gameDataProxy.spinEventData.playerTotalWin
        );
        self.gameDataProxy.symbolMatchInfo.resetInfo();

        let aryStrSceneName: string[] = [];
        for (let i = 0; i < gameStateResult.length; i++) {
            if (gameStateResult[i].gameSceneName != null) {
                let sceneName = gameStateResult[i].gameSceneName;
                aryStrSceneName.push(sceneName);
            }
        }
        self.gameDataProxy.sceneSetting.setSceneResultMap_ByResult(aryStrSceneName);

        // 更新 Html SpinNumber 欄位的值.
        self.sendNotification(UIEvent.UPDATE_SPIN_SEQ_NUM, self.gameDataProxy.spinSequenceNumber);

        if (self.gameDataProxy.spinEventData.bonusGameResult) {
            this.gameDataProxy.tempWonCredit = MathUtil.add(
                self.gameDataProxy.playerTotalWin,
                MathUtil.div(self.gameDataProxy.spinEventData.bonusGameResult.bonusGameTotalWin, 100),
                MathUtil.div(self.gameDataProxy.spinEventData.bonusGameResult.jackpotTotalWin, 100)
            );

            this.gameDataProxy.canUpdateJackpotPool = false;
        } else {
            this.gameDataProxy.tempWonCredit = self.gameDataProxy.playerTotalWin;
        }

        self.gameDataProxy.setBmd(notifyObj.balance, true);
        // 刷新 Credit
        this.sendNotification(UIEvent.UPDATE_PLAYER_BALANCE, this.gameDataProxy.cash);

        // 判斷是否為 Feature selection 結果
        if (this.gameDataProxy.gameState == StateMachineProxy.GAME1_FEATURESELECTION) {
            this.gameDataProxy.hasSelectionResponse = true;
        }
        // By Game Data Handle
        self.sendNotification(ByGameHandleCommand.NAME);
        // 開始解析資料
        self.sendNotification(CheckGameFlowCommand.NAME);

        this.sentGTMEvent(notifyObj);
    }

    protected setEndGameStateId(stateId: number): void {
        GameStateId.END = stateId;
    }
    protected changeWheelData(spinResult: SpinResult) {
        // 檢查有沒有 featureIdx
        // 修改每個場景的 wheelData
        let featureIdx = spinResult.baseGameResult.extendInfoForbaseGameResult.featureIdx;
        if (featureIdx >= 0) {
            let gameSceneList = Object.entries(GameSceneOption);
            for (let i = 2; i < gameSceneList.length; i++) {
                let GameStateSetting = this.gameDataProxy.getStateSettingByName(GameSceneOption[i]);
                if (GameStateSetting != undefined) {
                    GameStateSetting.setWheelData(featureIdx);
                }
            }
        }
    }

    protected sentGTMEvent(notifyObj: SpinGSResult) {
        if (!this.gameDataProxy.isFirstSpin) {
            GTMUtil.setGTMEvent('FirstSpin', {
                Member_ID: this.gameDataProxy.userId,
                Game_ID: this.gameDataProxy.machineType,
                DateTime: Date.now(),
                Session_ID: this.gameDataProxy.sessionId,
            });
            this.gameDataProxy.isFirstSpin = true;
        }

        let jp_Type = [];
        if (notifyObj.spinResult.bonusGameResult) {
            for (let i = 0; i < notifyObj.spinResult.bonusGameResult.bonusGameOneRoundResult.length; i++) {
                jp_Type.push(...notifyObj.spinResult.bonusGameResult.bonusGameOneRoundResult[i].hitPool);
            }
        }

        let freeGameType = '0';
        let freeGameWin = 0;
        let freeGameSpin = 0;
        if (notifyObj.spinResult.freeGameResult) {
            const specialHitInfo = notifyObj.spinResult.freeGameResult.freeGameOneRoundResult[0]?.specialHitInfo;
            switch (specialHitInfo) {
                case 'freeGame_01':
                    freeGameType = '1';
                    break;
                case 'freeGame_02':
                    freeGameType = '2';
                    break;
                case 'freeGame_03':
                    freeGameType = '3';
                    break;
            }

            freeGameWin = notifyObj.spinResult.freeGameResult.freeGameTotalWin;
            freeGameSpin = notifyObj.spinResult.freeGameResult.totalRound;
        }
        
        if (notifyObj.spinResult.topUpGameResult) {
            freeGameType = '4';

            freeGameWin = notifyObj.spinResult.topUpGameResult.topUpGameTotalWin;
            freeGameSpin = notifyObj.spinResult.topUpGameResult.totalRound;
        }

        GTMUtil.setGTMEvent('SpinResponse', {
            GameSeqNo: notifyObj.gameSeq,
            Bet_Type: '0',
            Bet_Multiplier: this.gameDataProxy.curBet,
            Feature_Bet: this._gameDataProxy.isOmniChannel() ? this.gameDataProxy.curFeatureBet : '1',
            OmniDenom: this._gameDataProxy.isOmniChannel() ? this.gameDataProxy.curDenomMultiplier : '1',
            BaseGame_Win: notifyObj.spinResult.baseGameResult.baseGameTotalWin,
            FreeGame_Win: freeGameWin,
            FreeGame_Type: freeGameType,
            FreeGame_Spin: freeGameSpin,
            FeatureGame_Win: '0',
            JP_Type: jp_Type,
            SpinSpeedMode: this.gameDataProxy.curSpeedMode,
            Session_ID: this.gameDataProxy.sessionId,
        });
    }
    // ======================== Get Set ========================

    protected _gameDataProxy: GameDataProxy;
    protected get gameDataProxy(): GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GameDataProxy.NAME) as GameDataProxy;
        }
        return this._gameDataProxy;
    }

    protected _webBridgeProxy: WebBridgeProxy;
    protected get webBridgeProxy(): WebBridgeProxy {
        if (!this._webBridgeProxy) {
            this._webBridgeProxy = this.facade.retrieveProxy(WebBridgeProxy.NAME) as WebBridgeProxy;
        }
        return this._webBridgeProxy;
    }

    protected _networkProxy: NetworkProxy;
    protected get networkProxy(): NetworkProxy {
        if (!this._networkProxy) {
            this._networkProxy = this.facade.retrieveProxy(NetworkProxy.NAME) as NetworkProxy;
        }
        return this._networkProxy;
    }
}
