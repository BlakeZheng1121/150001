import { _decorator, Component, Node } from 'cc';
import { NetworkProxy } from '../../core/proxy/NetworkProxy';
const { ccclass, property } = _decorator;

@ccclass('MockReconnectCommand')
export class MockReconnectCommand extends puremvc.SimpleCommand {
    public static readonly NAME = 'MockReconnectCommand';

    public execute(notification: puremvc.INotification): void {
        this.netProxy.reconnect();
    }

    /**  get */
    protected _NetProxy: NetworkProxy;
    protected get netProxy(): NetworkProxy {
        if (this._NetProxy == null) {
            this._NetProxy = this.facade.retrieveProxy(NetworkProxy.NAME) as NetworkProxy;
        }
        return this._NetProxy;
    }
}

