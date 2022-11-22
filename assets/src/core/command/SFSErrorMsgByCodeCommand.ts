import { CoreMsgCode } from '../constants/CoreMsgCode';
import { NetworkProxy } from '../proxy/NetworkProxy';
import { Logger } from '../utils/Logger';
import { ErrorCodeEvent } from '../vo/ErrorCodeEvent';

/**
 * 這邊專門處理SFS收到ErrorCode後 後續處理
 */
export class SFSErrorMsgByCodeCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = 'h5.error';

    public execute(notification: puremvc.INotification): void {
        const self = this;
        const body = notification.getBody();
        const errorCode: ErrorCodeEvent = body as ErrorCodeEvent;

        try {
            Logger.i('h5.error ' + errorCode.message);         
        } catch (e) {}

        switch(errorCode.code){
            case CoreMsgCode.ERR_BALANCE_NOT_ENOUGH:
                self.networkProxy.sendNotEnoughMsgAndReload();
                break;
        }       
    }

    protected _networkProxy: NetworkProxy;
    protected get networkProxy(): NetworkProxy {
        if (!this._networkProxy) {
            this._networkProxy = this.facade.retrieveProxy(NetworkProxy.NAME) as NetworkProxy;
        }
        return this._networkProxy;
    }
}
