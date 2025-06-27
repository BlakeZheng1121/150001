import { ReelDataProxy } from '../../proxy/ReelDataProxy';
import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { StateCommand } from './StateCommand';
import { StateMachineCommand } from 'src/core/command/StateMachineCommand';
import { StateMachineObject } from 'src/core/proxy/CoreStateMachineProxy';

export class Game4ShowWinCommand extends StateCommand {
    public static readonly NAME = StateMachineProxy.GAME4_EV_SHOWWIN;
    public execute(notification: puremvc.INotification): void {
        this.notifyWebControl();
        this.sendNotification(StateMachineCommand.NAME, new StateMachineObject(StateMachineProxy.GAME4_AFTERSHOW));
    }

    // ======================== Get Set ======================== 
    protected _reelDataProxy: ReelDataProxy;
    protected get reelDataProxy(): ReelDataProxy {
        if (!this._reelDataProxy) {
            this._reelDataProxy = this.facade.retrieveProxy(ReelDataProxy.NAME) as ReelDataProxy;
        }
        return this._reelDataProxy;
    }
}
