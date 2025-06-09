import { Logger } from '../../../core/utils/Logger';
import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { CheckGameFlowCommand } from '../CheckGameFlowCommand';
import { TakeWinCommand } from '../balance/TakeWinCommand';
import { StateCommand } from './StateCommand';
import { NetworkProxy } from '../../../core/proxy/NetworkProxy';
import { GameStateId } from '../../vo/data/GameStateId';
import { SymbolId } from '../../vo/enum/Reel';
import { BaseGameResult } from '../../vo/result/BaseGameResult';

export class Game1EndCommand extends StateCommand {
    public static readonly NAME = StateMachineProxy.GAME1_EV_END;

    public execute(notification: puremvc.INotification): void {
        this.notifyWebControl();
        /** 判斷是否有 Recovery紀錄資料，需要進行處理 */
        if (
            this.gameDataProxy.spinEventData != undefined &&
            this.gameDataProxy.reStateResult?.gameStateId == GameStateId.WAIT_FOR_CLIENT
        ) {
            if (this.hasThreeC2()) {
                this.changeState(StateMachineProxy.GAME2_INIT);
            } else {
                this.changeState(StateMachineProxy.GAME1_FEATURESELECTION);
            }
            return;
        }

        if (this.gameDataProxy.spinEventData.gameStateResult.length > 0) {
            this.sendNotification(CheckGameFlowCommand.NAME);
        } else {
            // 此處非Game1場景轉場後才會進來
            Logger.i('已無遊戲狀態需表演 狀態切換為 Idle.(觸發此位置，原因應該為別的場景轉場回 Game_1 然後滾分滾滿)');
            //贏分加入表底
            //針對MiniGame結束回BaseGame的表演流程
            this.sendNotification(TakeWinCommand.NAME);
            this.changeState(StateMachineProxy.GAME1_IDLE);
        }
    }

    protected _networkProxy: NetworkProxy;
    protected get networkProxy(): NetworkProxy {
        if (!this._networkProxy) {
            this._networkProxy = this.facade.retrieveProxy(NetworkProxy.NAME) as NetworkProxy;
        }
        return this._networkProxy;
    }

    private hasThreeC2(): boolean {
        const result = this.gameDataProxy.spinEventData.baseGameResult as BaseGameResult;
        let count = 0;
        for (let x = 0; x < result.screenSymbol.length; x++) {
            for (let y = 0; y < result.screenSymbol[x].length; y++) {
                if (result.screenSymbol[x][y] === SymbolId.C2) {
                    count++;
                    if (count >= 3) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
