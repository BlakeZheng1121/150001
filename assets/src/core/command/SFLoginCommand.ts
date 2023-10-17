import { WebBridgeProxy } from '../../sgv3/proxy/WebBridgeProxy';
import { CoreGameDataProxy } from '../proxy/CoreGameDataProxy';
import { CoreSGGameLoginReturn } from '../vo/CoreSGGameLoginReturn';
import { SFSGameLoginErrorCommand } from './SFSGameLoginErrorCommand';

export class SFLoginCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = 'gameLoginReturn';
    public static readonly EV_CONNECTION: string = 'EV_CONNECTION';

    public execute(notification: puremvc.INotification): void {
        const self = this;
        const body: SFS2X.SFSObject = notification.getBody();
        const gameLoginReturn: CoreSGGameLoginReturn = new CoreSGGameLoginReturn(body);
        const isConnected = gameLoginReturn.data;
        if (isConnected) {
            const gameDataProxy = self.facade.retrieveProxy(CoreGameDataProxy.NAME) as CoreGameDataProxy;
            gameDataProxy.userId = gameLoginReturn.showName;
            gameDataProxy.setBmd(gameLoginReturn.balance, true);
            gameDataProxy.hasTestMode = gameLoginReturn.testMode;
            self.facade.sendNotification(SFLoginCommand.EV_CONNECTION, gameLoginReturn);
        } else {
            self.facade.sendNotification(SFSGameLoginErrorCommand.NAME, body);
        }

        let data = {
            gameID: "1030",
            logTag: 'Login-SFLoginCommand',
            isConnected: isConnected,
        };
        let pack = {name:'gameLog', data: data};
        this.webBridgeProxy.sendPlayerData(pack);
    }

    private _webBridgeProxy: WebBridgeProxy;
    public get webBridgeProxy(): WebBridgeProxy {
        if (!this._webBridgeProxy) {
            this._webBridgeProxy = this.facade.retrieveProxy(WebBridgeProxy.NAME) as WebBridgeProxy;
        }

        return this._webBridgeProxy;
    }
}
