import { GameDataProxy } from '../../sgv3/proxy/GameDataProxy';
import { WebBridgeProxy } from '../../sgv3/proxy/WebBridgeProxy';
import { NetworkProxy } from '../proxy/NetworkProxy';
import { Logger } from '../utils/Logger';
import { SettlePlayResponseObject } from '../vo/SettlePlayResponseObject';

export class SettlePlayResponseCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = 'h5.settlePlayResponse';

    public execute(notification: puremvc.INotification): void {
        Logger.i('[SettlePlayResponseCommand] Execute');

        //ToDO: 暫時先用資料判斷來源是SmartFox，還是OddsWork.
        if (notification.getBody() != undefined) {
            let settlePlayResponse: SettlePlayResponseObject = notification.getBody();
            if (settlePlayResponse.result != 'OK') {
                Logger.e('[Error] SETTLE_PLAY IS FAIL!?');
            } else {
                this.gameDataProxy.canUpdateJackpotPool = true;
                this.gameDataProxy.setBmd(settlePlayResponse.balance);
                this.webBridgeProxy.updateHtmlCredit();
            }
        }

        this.networkProxy.resetSendSpinState();
    }

    // ======================== Get Set ========================
    protected _gameDataProxy: GameDataProxy;
    protected get gameDataProxy(): GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GameDataProxy.NAME) as GameDataProxy;
        }
        return this._gameDataProxy;
    }

    protected _networkProxy: NetworkProxy;
    protected get networkProxy(): NetworkProxy {
        if (!this._networkProxy) {
            this._networkProxy = this.facade.retrieveProxy(NetworkProxy.NAME) as NetworkProxy;
        }
        return this._networkProxy;
    }

    protected _webBridgeProxy: WebBridgeProxy;
    protected get webBridgeProxy(): WebBridgeProxy {
        if (!this._webBridgeProxy) {
            this._webBridgeProxy = this.facade.retrieveProxy(WebBridgeProxy.NAME) as WebBridgeProxy;
        }
        return this._webBridgeProxy;
    }
}
