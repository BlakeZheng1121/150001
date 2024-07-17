import { Game1HitSpecialCommand } from '../../../sgv3/command/state/Game1HitSpecialCommand';
import { StateMachineProxy } from '../../../sgv3/proxy/StateMachineProxy';
import { WinEvent } from '../../../sgv3/util/Constant';
import { SpecialHitInfo } from '../../../sgv3/vo/enum/SpecialHitInfo';
import { BonusGameOneRoundResult } from '../../../sgv3/vo/result/BonusGameOneRoundResult';

export class GAME_Game1HitSpecialCommand extends Game1HitSpecialCommand {
    protected timerKey_HitGrand = 'game1HitGrand';
    public execute(notification: puremvc.INotification): void {
        const getGrand = (oneRoundResult: BonusGameOneRoundResult) =>
            oneRoundResult.specialHitInfo == SpecialHitInfo[SpecialHitInfo.bonusGame_02];
        // only Hit Grand in one game cycle
        let grandCash =
            this.gameDataProxy.spinEventData.bonusGameResult.bonusGameOneRoundResult.find(getGrand).oneRoundJPTotalWin;
        this.sendNotification(WinEvent.ON_HIT_GRAND, {
            grandCash: grandCash,
            callback: this.endGame1HitGrand.bind(this)
        });
    }

    protected endGame1HitGrand() {
        // 移除已經表演過的bonus資料
        const removeResult = (result: BonusGameOneRoundResult) =>
            result.specialHitInfo != SpecialHitInfo[SpecialHitInfo.bonusGame_02];
        this.gameDataProxy.spinEventData.bonusGameResult.bonusGameOneRoundResult =
            this.gameDataProxy.spinEventData.bonusGameResult.bonusGameOneRoundResult.filter(removeResult);
        this.changeState(StateMachineProxy.GAME1_BEFORESHOW);
    }
}
