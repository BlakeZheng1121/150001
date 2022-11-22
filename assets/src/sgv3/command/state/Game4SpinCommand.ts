import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { TopUpGameOneRoundResult } from '../../vo/result/TopUpGameOneRoundResult';
import { ClearRecoveryDataCommand } from '../recovery/ClearRecoveryDataCommand';
import { SpinRequestCommand } from '../spin/SpinRequestCommand';
import { StateCommand } from './StateCommand';

export class Game4SpinCommand extends StateCommand {
    public static readonly NAME = StateMachineProxy.GAME4_EV_SPIN;

    public execute(notification: puremvc.INotification): void {
        this.notifyWebControl();
        this.sendNotification(SpinRequestCommand.NAME);

        if (this.gameDataProxy.reStateResult != undefined) {
            this.sendNotification(ClearRecoveryDataCommand.NAME);
        }
    }
}
