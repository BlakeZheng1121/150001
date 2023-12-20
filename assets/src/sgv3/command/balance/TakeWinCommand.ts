import { NetworkProxy } from '../../../core/proxy/NetworkProxy';
import { GameDataProxy } from '../../proxy/GameDataProxy';
import { WebBridgeProxy } from '../../proxy/WebBridgeProxy';

export class TakeWinCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = 'TakeWinCommand';

    public execute(notification: puremvc.INotification): void {
        const self = this;

        let totalWin = self.gameDataProxy._tempWonCredit;
        this.gameDataProxy.setBmd(self.gameDataProxy.realCash + totalWin);
        this.webBridgeProxy.updateHtmlCredit();
        // 滾分完畢，將贏分加入到balance欄位.
        self.gameDataProxy.resetTempWonCredit();

        this.networkProxy.sendSettlePlay(totalWin);
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
