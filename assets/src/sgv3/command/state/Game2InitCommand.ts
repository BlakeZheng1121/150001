import { UIEvent } from 'common-ui/proxy/UIEvent';
import { Logger } from '../../../core/utils/Logger';
import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { ReelEvent, WinEvent, ViewMediatorEvent, StateWinEvent } from '../../util/Constant';
import { FreeGameOneRoundResult } from '../../vo/result/FreeGameOneRoundResult';
import { StateCommand } from './StateCommand';
import { ButtonName } from 'common-ui/proxy/UIEnums';
import { SpinButton } from 'common-ui/view/SpinButton';

export class Game2InitCommand extends StateCommand {
    public static readonly NAME = StateMachineProxy.GAME2_EV_INIT;

    protected timerKey = 'game2Init';
    public execute(notification: puremvc.INotification): void {
        this.notifyWebControl();
        let cashAmount = 0;
        let freeGameOneRoundResult = this.gameDataProxy.curRoundResult as FreeGameOneRoundResult;

        this.sendNotification(ReelEvent.ON_REELS_INIT); //Reel ByGame資料 Init
        this.sendNotification(UIEvent.CHANGE_BUTTON_STATE, { name: ButtonName.SPIN, state: SpinButton.STATUS_IDLE });

        if (this.gameDataProxy.reStateResult) {
            this.sendNotification(ViewMediatorEvent.SHOW_FREE_SPIN_MSG); //顯示Free Spin次數的UI
            this.sendNotification(StateWinEvent.ON_GAME2_TRANSITIONS, false); //通知轉場
            this.changeState(StateMachineProxy.GAME2_IDLE);
            return;
        }

        if (this.gameDataProxy.curRoundResult) {
            cashAmount = this.gameDataProxy.convertCredit2Cash(
                freeGameOneRoundResult.displayLogicInfo.beforeAccumulateWinWithBaseGameWin
            );

            // 剛進入FreeGame場景時，重置盤面(※中間回來的不用重置盤面)
            if (freeGameOneRoundResult.roundInfo.roundNumber == 1) {
                this.checkJackpotPool();
                this.sendNotification(WinEvent.FORCE_WIN_DISPOSE);
                this.sendNotification(WinEvent.FORCE_UPDATE_WIN_LABEL, cashAmount);
            }
            this.sendNotification(ViewMediatorEvent.SHOW_FREE_SPIN_MSG); //顯示Free Spin次數的UI
            this.sendNotification(ViewMediatorEvent.SHOW_WON_SPIN_DATA, freeGameOneRoundResult.roundInfo.totalRound);
        } else {
            Logger.w('非正常流程進入 ' + this.gameDataProxy.curScene);
        }
    }
}
