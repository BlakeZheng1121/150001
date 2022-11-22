import { StateMachineCommand } from '../../../core/command/StateMachineCommand';
import { StateMachineObject } from '../../../core/proxy/CoreStateMachineProxy';
import { GameDataProxy } from '../../proxy/GameDataProxy';
import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { WinEvent } from '../../util/Constant';

/** Autoplay下 大獎表演全贏分線後直接到下一把處理 */
export class AutoplayShowAllLineCompleteCommand extends puremvc.SimpleCommand {
    public static NAME = WinEvent.SHOW_LINES_COMPLETE;

    public execute(notification: puremvc.INotification): void {
        if (
            this.gameDataProxy.onAutoPlay &&
            this.gameDataProxy.gameState == StateMachineProxy.GAME1_SHOWWIN &&
            this.gameDataProxy.isGradeWin()
        ) {
            this.sendNotification(WinEvent.SHOW_WIN_ASSEMBLE_COMPLETE);
            this.sendNotification(StateMachineCommand.NAME, new StateMachineObject(StateMachineProxy.GAME1_AFTERSHOW));
        }
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
