import { StateMachineCommand } from '../../core/command/StateMachineCommand';
import { StateMachineObject } from '../../core/proxy/CoreStateMachineProxy';
import { GameDataProxy } from '../proxy/GameDataProxy';
import { StateMachineProxy } from '../proxy/StateMachineProxy';
import { ScreenEvent, WinEvent } from '../util/Constant';
import { GameScene } from '../vo/data/GameScene';
import { WinBoardState } from '../vo/enum/WinBoardState';

/** Game1 重置可以spin */
export class ResetGame1CanSpinCommand extends puremvc.SimpleCommand {
    public static NAME = ScreenEvent.ON_SPIN_DOWN;

    public execute(notification: puremvc.INotification): void {
        if (this.gameDataProxy.curScene != GameScene.Game_1) return; //不為game1不處理

        if (this.gameDataProxy.gameState == StateMachineProxy.GAME1_SHOWWIN) {
            // 下列情境皆為ShowWin才會需要處理
            if (this.gameDataProxy.winBoardState != WinBoardState.HIDE) {
                // 關閉分級贏分面板
                this.sendNotification(WinEvent.HIDE_BOARD_REQUEST);
            } else if (this.gameDataProxy.runWinComplete) {
                // 滾分滾停後，再次點擊 Spin 按鈕時，切狀態到 IDLE 並直接 Spin 流程.
                if (!this.gameDataProxy.isHitSpecial()) {
                    this.sendNotification(
                        StateMachineCommand.NAME,
                        new StateMachineObject(StateMachineProxy.GAME1_AFTERSHOW)
                    );
                    this.gameDataProxy.readySpin = true;
                }
            }
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
