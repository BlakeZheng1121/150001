import { JackpotPoolProxy } from '../../proxy/JackpotPoolProxy';
import { JackpotTypeObj } from '../../vo/jackpot/JackpotTypeObj';

export class JackpotPoolCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = 'jackpotPoolNotify';
    protected jackpotPoolProxy: JackpotPoolProxy;

    public execute(notification: puremvc.INotification): void {
        let jackpotTypeObj: JackpotTypeObj = notification.getBody();
        this.jackpotPoolProxy = this.getJackpotPoolProxy();

        if (jackpotTypeObj.typeItems.length > 3) {
            // 有含mini的是初始池
            this.jackpotPoolProxy.jackpotTypeObjInit = jackpotTypeObj;
        }
        this.jackpotPoolProxy.jackpotTypeObj = jackpotTypeObj;
    }

    protected getJackpotPoolProxy(): JackpotPoolProxy {
        return this.facade.retrieveProxy(JackpotPoolProxy.NAME) as JackpotPoolProxy;
    }
}
