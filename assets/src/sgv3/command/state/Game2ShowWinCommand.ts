import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { ReelEvent } from '../../util/Constant';
import { GameScene } from '../../vo/data/GameScene';
import { GlobalTimer } from '../../util/GlobalTimer';
import { ScoringHandleCommand } from '../byGame/ScoringHandleCommand';
import { StateCommand } from './StateCommand';

export class Game2ShowWinCommand extends StateCommand {
    public static readonly NAME = StateMachineProxy.GAME2_EV_SHOWWIN;
    public execute(notification: puremvc.INotification): void {
        this.notifyWebControl();

        if (this.gameDataProxy.preScene === GameScene.Game_3) {
            if (this.gameDataProxy.stateWinData.totalAmount() > 0) {
                this.sendNotification(ReelEvent.SHOW_REELS_WIN, this.gameDataProxy.curWinData);
            }
            GlobalTimer.getInstance()
                .registerTimer(
                    'showWinToAfterShow',
                    1.0,
                    () => {
                        GlobalTimer.getInstance().removeTimer('showWinToAfterShow');
                        this.changeState(StateMachineProxy.GAME2_AFTERSHOW);
                    },
                    this
                )
                .start();
        } else {
            this.showView();
        }
    }

    /** 通知show線 */
    protected showView() {
        if (this.gameDataProxy.stateWinData.totalAmount() > 0) {
            if (this.gameDataProxy.afterFeatureGame) {
                this.sendNotification(ReelEvent.SHOW_REELS_WIN, this.gameDataProxy.curWinData);
                this.sendNotification(ScoringHandleCommand.NAME);
            } else {
                this.sendNotification(ReelEvent.SHOW_ALL_REELS_WIN, this.gameDataProxy.curWinData);
            }
        } else {
            this.sendNotification(ScoringHandleCommand.NAME);
        }
    }
}
