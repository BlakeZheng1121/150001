import { CoreGameDataProxy } from '../proxy/CoreGameDataProxy';
import { ChangeBalanceEvent } from '../vo/ChangeBalanceEvent';

export class ChangeBalanceCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = 'gs.changeBalance';
    public static readonly EV_CHANGE_BALANCE: string = 'EV_CHANGE_BALANCE';

    public execute(notification: puremvc.INotification): void {
        const result = notification.getBody();
        let balance: number;
        let ts: number;
        if (notification.getBody() instanceof SFS2X.SFSObject) {
            const object = notification.getBody() as SFS2X.SFSObject;
            balance = object.getDouble('balance');
            ts = object.getLong('ts');
        } else {
            balance = result.balance;
            ts = result.ts;
        }
        const changeBalanceEvent: ChangeBalanceEvent = new ChangeBalanceEvent(ts, balance);
        const gameDataProxy = this.facade.retrieveProxy(CoreGameDataProxy.NAME) as CoreGameDataProxy;
        if (changeBalanceEvent.ts > gameDataProxy.tsBmd) {
            gameDataProxy.tsBmd = changeBalanceEvent.ts;
            gameDataProxy.setBmd(changeBalanceEvent.balance, true);
            this.sendNotification(ChangeBalanceCommand.EV_CHANGE_BALANCE, changeBalanceEvent);
        }
    }
}
