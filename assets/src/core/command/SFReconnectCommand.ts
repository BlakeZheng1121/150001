import { DEBUG } from 'cc/env';
import { CoreGameDataProxy } from '../proxy/CoreGameDataProxy';
import { CoreWebBridgeProxy } from '../proxy/CoreWebBridgeProxy';
import { IGameConfig } from '../vo/IGameConfig';
import { NetworkProxy } from '../proxy/NetworkProxy';
import { CoreSFDisconnectionCommand } from './CoreSFDisconnectionCommand';
import { CoreStateMachineProxy } from '../proxy/CoreStateMachineProxy';

export class SFReconnectCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = 'EV_RECONNECT';
    private retryTime: number = 0;
    private retryMaxTime: number = 2;
    private config: IGameConfig;
    private notification: any;

    public execute(notification: puremvc.INotification): void {
        const self = this;
        self.config = {};
        self.notification = notification.getBody();
        if (self.gameDataProxy.isReconnecting) {
            return;
        } else if (self.webBridgeProxy.isTriggerErrorCode) {
            self.sendNotification(CoreSFDisconnectionCommand.NAME, self.notification);
            return;
        }
        self.handleCommonStatus();
    }

    private handleCommonStatus(): void {
        const self = this;
        const state = self.gameDataProxy.gameState;
        const netProxy = self.facade.retrieveProxy(NetworkProxy.NAME) as NetworkProxy;
        const stateMachineProxy = self.facade.retrieveProxy(CoreStateMachineProxy.NAME) as CoreStateMachineProxy;
        const disconnectedState = stateMachineProxy.checkDisconnectedState(state);
        if (!netProxy.isConnected() && disconnectedState) {
            self.checkReconnect();
        } else {
            if (disconnectedState == undefined) {
                self.checkReconnect();
            }
        }
    }

    protected checkReconnect() {
        const self = this;
        if (DEBUG) {
            // Debug Cocos開發模式下,因為沒有Container,所以直接斷線, 有需要作重連的話, 直接使用Mock按鈕上的Reconnect
            self.sendNotification(CoreSFDisconnectionCommand.NAME, self.notification);
        } else {
            const self = this;
            const netProxy = self.facade.retrieveProxy(NetworkProxy.NAME) as NetworkProxy;
            if (!netProxy.getSentSpinRequest()) {
                self.retryTime = 0;
                self.gameDataProxy.isReconnecting = true;
                self.countdownDisconnect();
                self.sendGetTicketRequest();
                self.registeringGetTicketRequest();
            } else {
                self.sendNotification(CoreSFDisconnectionCommand.NAME, self.notification);
            }
        }
    }

    protected registeringGetTicketRequest(time: number = 5000) {
        const self = this;
        if (self.retryTime >= self.retryMaxTime) {
            return;
        }
        self.networkProxy.getTicketRegister = setTimeout(() => {
            self.retryTime++;
            self.sendGetTicketRequest();
        }, time);
    }

    public countdownDisconnect(time: number = 15000): void {
        const self = this;
        self.networkProxy.reconnectionRegister = setTimeout(() => {
            self.webBridgeProxy.getWebObjRequest(this, 'reconnectFinished');
            self.networkProxy.reconnectFail();
            self.sendNotification(CoreSFDisconnectionCommand.NAME);
        }, time);
    }

    public handleContainerMsg(e: MessageEvent) {
        if (JSON.parse(e.data).name === 'updateTicket') {
            const ticket = JSON.parse(e.data).data;
            this.setupGameDataProxy(ticket);
            this.setupProxy(this.config, ticket);
            // 取得 Ticket 才進行Reconnect
            if (!this.networkProxy.isConnected()) {
                this.networkProxy.reconnect();
            }
            if (this.webBridgeProxy.listenerMap.has('reconnect')) {
                this.webBridgeProxy.listenerMap.delete('reconnect');
            }
        }
    }

    protected setupGameDataProxy(ticket: any) {
        let gameDataProxy: CoreGameDataProxy = this.getGameDataProxy();
        gameDataProxy.gameType = ticket['gameType'];
        gameDataProxy.machineType = ticket['machineType'];
        gameDataProxy.currency = ticket['currency'];
        gameDataProxy.connectedTimeout = ticket['gameConnectionTimeout'];
        gameDataProxy.resLoadingTimeout = ticket['gameResourceTimeout'];
    }

    protected sendGetTicketRequest() {
        this.webBridgeProxy.listenerMap.set('updateTicket', this);
        this.webBridgeProxy.getWebObjRequest(this, 'reconnect');
        console.log("sendGetTicketRequest");
    }

    protected getGameDataProxy(): CoreGameDataProxy {
        return this.facade.retrieveProxy(CoreGameDataProxy.NAME) as CoreGameDataProxy;
    }

    protected setupProxy(config: IGameConfig, otherData?: any): void {
        this.networkProxy.setConfig(config, otherData);
    }

    // ======================== Get Set ========================
    protected _networkProxy: NetworkProxy;
    protected get networkProxy(): NetworkProxy {
        if (!this._networkProxy) {
            this._networkProxy = this.facade.retrieveProxy(NetworkProxy.NAME) as NetworkProxy;
        }
        return this._networkProxy;
    }

    protected _webBridgeProxy: CoreWebBridgeProxy;
    protected get webBridgeProxy(): CoreWebBridgeProxy {
        if (!this._webBridgeProxy) {
            this._webBridgeProxy = this.facade.retrieveProxy(CoreWebBridgeProxy.NAME) as CoreWebBridgeProxy;
        }
        return this._webBridgeProxy;
    }

    protected _gameDataProxy: CoreGameDataProxy;
    protected get gameDataProxy(): CoreGameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(CoreGameDataProxy.NAME) as CoreGameDataProxy;
        }
        return this._gameDataProxy;
    }
}
