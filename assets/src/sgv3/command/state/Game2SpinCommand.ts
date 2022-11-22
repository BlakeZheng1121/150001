import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { ClearRecoveryDataCommand } from '../recovery/ClearRecoveryDataCommand';
import { SpinRequestCommand } from '../spin/SpinRequestCommand';
import { StateCommand } from './StateCommand';

export class Game2SpinCommand extends StateCommand {
    public static readonly NAME = StateMachineProxy.GAME2_EV_SPIN;

    public execute(notification: puremvc.INotification): void {
        this.notifyWebControl();
        this.sendNotification(SpinRequestCommand.NAME);

        if (this.gameDataProxy.reStateResult != undefined) {
            this.sendNotification(ClearRecoveryDataCommand.NAME);
        }
    }
}
