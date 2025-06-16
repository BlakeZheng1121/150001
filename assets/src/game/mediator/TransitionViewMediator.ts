import { _decorator } from 'cc';
import BaseMediator from '../../base/BaseMediator';
import { Logger } from '../../core/utils/Logger';
import { SceneManager } from '../../core/utils/SceneManager';
import {
    ScreenEvent,
    StateWinEvent,
    ViewMediatorEvent,
    WebGameState
} from '../../sgv3/util/Constant';
import { StateMachineCommand } from '../../core/command/StateMachineCommand';
import { StateMachineObject } from '../../core/proxy/CoreStateMachineProxy';
import { StateMachineProxy } from '../../sgv3/proxy/StateMachineProxy';
import { WebBridgeProxy } from '../../sgv3/proxy/WebBridgeProxy';
import { GlobalTimer } from '../../sgv3/util/GlobalTimer';
import { GAME_TransitionView } from '../view/GAME_TransitionView';
const { ccclass } = _decorator;

@ccclass('TransitionViewMediator')
export class TransitionViewMediator extends BaseMediator<GAME_TransitionView> {
    public static readonly NAME: string = 'TransitionViewMediator';

    public transitionView: GAME_TransitionView = null;
    private waitForSpin: boolean = false;

    constructor(name?: string, component?: any) {
        super(TransitionViewMediator.NAME, component);
        Logger.i('[TransitionMediator] constructor()');
    }

    protected lazyEventListener(): void {
        this.transitionView = this.viewComponent;
    }

    public listNotificationInterests(): Array<any> {
        let eventList = [
            SceneManager.EV_ORIENTATION_VERTICAL,
            SceneManager.EV_ORIENTATION_HORIZONTAL,
            StateWinEvent.ON_GAME2_TRANSITIONS,
            StateWinEvent.ON_GAME4_TRANSITIONS,
            ViewMediatorEvent.CHANGE_DISPLAY_CONTAINER,
            ScreenEvent.ON_SPIN_DOWN
        ];
        return eventList;
    }

    public handleNotification(notification: puremvc.INotification) {
        const self = this;
        let name = notification.getName();

        switch (name) {
            case SceneManager.EV_ORIENTATION_VERTICAL:
                self.onOrientationVertical();
                break;
            case SceneManager.EV_ORIENTATION_HORIZONTAL:
                self.onOrientationHorizontal();
                break;
            case StateWinEvent.ON_GAME2_TRANSITIONS:
                if (notification.getBody() == true) {
                    self.onTransitionToFree();
                    self.waitForSpin = true;
                } else {
                    self.onHideStartBoard();
                }
                break;
            case StateWinEvent.ON_GAME4_TRANSITIONS:
                if (notification.getBody() == true) self.onTransitionBGEffect();
                break;
            case ScreenEvent.ON_SPIN_DOWN:
                if (self.waitForSpin) {
                    self.waitForSpin = false;
                    self.onHideStartBoard();
                    self.startGame2Transition();
                }
                break;
        }
    }

    /** 執行橫式轉換 */
    protected onOrientationHorizontal(): void {
        if (this.transitionView) {
            this.transitionView.changeOrientation(GAME_TransitionView.HORIZONTAL);
        }
    }

    /** 執行直式轉換 */
    protected onOrientationVertical(): void {
        if (this.transitionView) {
            this.transitionView.changeOrientation(GAME_TransitionView.VERTICAL);
        }
    }

    /** 開啟 轉場動畫*/
    protected onTransitionBGEffect() {
        GlobalTimer.getInstance()
            .registerTimer(
                'onTransitionBGEffect',
                1.3,
                () => {
                    GlobalTimer.getInstance().removeTimer('onTransitionBGEffect');
                    this.transitionView.showTransition();
                },
                this
            )
            .start();
    }

    /** FreeGame Start Board*/
    protected onTransitionToFree() {
        GlobalTimer.getInstance()
            .registerTimer(
                'onTransitionBGEffect',
                1.3,
                () => {
                    GlobalTimer.getInstance().removeTimer('onTransitionBGEffect');
                    this.transitionView.showStartBoard();
                },
                this
            )
            .start();
    }

    protected onHideStartBoard() {
        this.transitionView.hideStartBoard?.();
    }

    protected startGame2Transition() {
        this.sendNotification(StateMachineCommand.NAME, new StateMachineObject(StateMachineProxy.GAME2_INIT));

        this.sendNotification(ViewMediatorEvent.LEAVE);
        this.sendNotification(ViewMediatorEvent.ENTER);
        this.webBridgeProxy.sendGameState(WebBridgeProxy.curScene, WebGameState.INIT);
    }

    private _webBridgeProxy: WebBridgeProxy;
    protected get webBridgeProxy(): WebBridgeProxy {
        if (!this._webBridgeProxy) {
            this._webBridgeProxy = this.facade.retrieveProxy(WebBridgeProxy.NAME) as WebBridgeProxy;
        }
        return this._webBridgeProxy;
    }
}
