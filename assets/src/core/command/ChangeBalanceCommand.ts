import { StateMachineProxy } from '../../sgv3/proxy/StateMachineProxy';
import { WebBridgeProxy } from '../../sgv3/proxy/WebBridgeProxy';
import { CoreGameDataProxy } from '../proxy/CoreGameDataProxy';
import { ChangeBalanceEvent } from '../vo/ChangeBalanceEvent';

export class ChangeBalanceCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = 'gs.changeBalance';

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

        if (ts > this.gameDataProxy.tsBmd && this.checkUpdateBalance()) {
            this.gameDataProxy.tsBmd = ts;
            this.gameDataProxy.setBmd(balance, true);
            this.webBridgeProxy.updateHtmlCredit();
        }
    }

    protected checkUpdateBalance(): boolean {
        return this.gameDataProxy.gameState == StateMachineProxy.GAME1_IDLE;
    }

    protected _gameDataProxy: CoreGameDataProxy;
    protected get gameDataProxy(): CoreGameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(CoreGameDataProxy.NAME) as CoreGameDataProxy;
        }
        return this._gameDataProxy;
    }

    protected _webBridgeProxy: WebBridgeProxy;
    protected get webBridgeProxy(): WebBridgeProxy {
        if (!this._webBridgeProxy) {
            this._webBridgeProxy = this.facade.retrieveProxy(WebBridgeProxy.NAME) as WebBridgeProxy;
        }
        return this._webBridgeProxy;
    }
}
