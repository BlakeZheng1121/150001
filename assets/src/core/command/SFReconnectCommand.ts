import { CoreGameDataProxy } from '../proxy/CoreGameDataProxy';
import { CoreWebBridgeProxy } from '../proxy/CoreWebBridgeProxy';

export class SFReconnectCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = 'EV_RECONNECT';

    public execute(notification: puremvc.INotification): void {
        this.reconnect();
    }

    private reconnect(): void {
        const self = this;
        const gameDataProxy = self.facade.retrieveProxy(CoreGameDataProxy.NAME) as CoreGameDataProxy;
        gameDataProxy.isReconnecting = true;
        let webBridgeProxy: CoreWebBridgeProxy = self.facade.retrieveProxy(
            CoreWebBridgeProxy.NAME
        ) as CoreWebBridgeProxy;
        webBridgeProxy.reconnect();
    }
}
