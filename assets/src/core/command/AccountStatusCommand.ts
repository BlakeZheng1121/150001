import { CoreMsgCode } from '../constants/CoreMsgCode';
import { CoreWebBridgeProxy } from '../proxy/CoreWebBridgeProxy';

export class AccountStatusCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = 'gs.SC_ACCOUNT_STATUS';

    public execute(notification: puremvc.INotification): void {
        const result = notification.getBody() as SFS2X.SFSObject;
        const status_code: number = CoreMsgCode.ACCOUNT_STATUS[result.getInt('status_code')];
        const err_msg: number = result.getInt('err_msg');
        const webBridgeProxy: CoreWebBridgeProxy = this.facade.retrieveProxy(
            CoreWebBridgeProxy.NAME
        ) as CoreWebBridgeProxy;
        webBridgeProxy.sendMsgCode(status_code, err_msg);
        /**TODO
         * stop all sound
         */
    }
}
