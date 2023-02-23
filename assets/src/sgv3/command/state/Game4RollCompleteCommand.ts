import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { StateCommand } from './StateCommand';
import { GameScene } from '../../vo/data/GameScene';
import { TopUpGameOneRoundResult } from '../../vo/result/TopUpGameOneRoundResult';
export class Game4RollCompleteCommand extends StateCommand {
    public static readonly NAME = StateMachineProxy.GAME4_EV_ROLLCOMPLETE;

    public execute(notification: puremvc.INotification): void {
        this.notifyWebControl();
        let topUpGameOneRoundResult: TopUpGameOneRoundResult = this.gameDataProxy
            .curRoundResult as TopUpGameOneRoundResult;

        // 進入Roll代表可以重置preScene為當前的Scene
        this.gameDataProxy.preScene = GameScene.Game_4;

        // 判斷是否有特殊獎項 Mystery Grand
        let isHitGrand = this.gameDataProxy.isHitGrand();

        // 判斷是否有特殊獎項
        if (
            (!!topUpGameOneRoundResult && topUpGameOneRoundResult.extendInfoForTopUpGameResult.isRetrigger) ||
            isHitGrand
        ) {
            this.changeState(StateMachineProxy.GAME4_HITSPECIAL, isHitGrand);
            return;
        } else {
            this.changeState(StateMachineProxy.GAME4_BEFORESHOW);
        }
    }
}
