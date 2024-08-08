import { _decorator } from 'cc';
import { GameDataProxy } from '../../sgv3/proxy/GameDataProxy';
import { StateMachineProxy } from '../../sgv3/proxy/StateMachineProxy';
import { UIEvent } from 'common-ui/proxy/UIEvent';
import { ButtonName, ButtonState } from 'common-ui/proxy/UIEnums';
import { GameScene } from 'src/sgv3/vo/data/GameScene';
const { ccclass } = _decorator;

@ccclass('CheckNormalButtonStateCommand')
export class CheckNormalButtonStateCommand extends puremvc.SimpleCommand {
    public static readonly NAME = 'CheckNormalButtonStateCommand';

    public execute(notification: puremvc.INotification): void {
        if (this.gameDataProxy.onAutoPlay == false && this.gameDataProxy.gameState == StateMachineProxy.GAME1_IDLE) {
            this.sendNotification(UIEvent.ENABLE_NORMAL_BUTTON);
        } else {
            /* if (this.gameDataProxy.curScene !== GameScene.Game_2)  */ this.sendNotification(
                UIEvent.DISABLE_NORMAL_BUTTON
            );
        }
        /* if (
            this.gameDataProxy.curScene !== GameScene.Game_2 &&
            (this.gameDataProxy.onFreeSpin || this.gameDataProxy.onCardUse)
        ) {
            this.sendNotification(UIEvent.CHANGE_BUTTON_STATE, {
                name: ButtonName.RAISE_BET,
                state: ButtonState.DISABLED
            });
            this.sendNotification(UIEvent.CHANGE_BUTTON_STATE, {
                name: ButtonName.REDUCE_BET,
                state: ButtonState.DISABLED
            });
            this.sendNotification(UIEvent.CHANGE_BUTTON_STATE, {
                name: ButtonName.TOTAL_BET,
                state: ButtonState.DISABLED
            });
        } */
    }

    // ======================== Get Set ========================
    protected _gameDataProxy: GameDataProxy;
    protected get gameDataProxy(): GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GameDataProxy.NAME) as GameDataProxy;
        }
        return this._gameDataProxy;
    }
}
