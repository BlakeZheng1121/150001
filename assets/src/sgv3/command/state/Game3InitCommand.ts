import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { StateWinEvent, ViewMediatorEvent, WinEvent } from '../../util/Constant';
import { GlobalTimer } from '../../util/GlobalTimer';
import { StateCommand } from './StateCommand';

export class Game3InitCommand extends StateCommand {
    public static readonly NAME = StateMachineProxy.GAME3_EV_INIT;

    protected timerKey = 'Game3Init';
    private delayTimeNormal = 5;
    private delayTimeRecovery = 0;

    public execute(notification: puremvc.INotification): void {
        const self = this;
        self.notifyWebControl();
        const SceneData = self.gameDataProxy.getSceneDataByName(self.gameDataProxy.curScene);
        self.sendNotification(WinEvent.FORCE_WIN_DISPOSE);
        self.sendNotification(ViewMediatorEvent.CLOSE_FREE_SPIN_MSG);
        let delayTime = 0;
        //判斷是否需要重置牌面
        if (self.gameDataProxy.reStateResult) {
            delayTime = self.delayTimeRecovery;
            self.sendNotification(StateWinEvent.ON_GAME3_RECOVERY);
        } else {
            delayTime = self.delayTimeNormal;
        }
        GlobalTimer.getInstance().registerTimer(self.timerKey, delayTime, self.endGame3Init, self).start();
        
        this.checkJackpotPool();
    }

    protected endGame3Init() {
        const self = this;
        GlobalTimer.getInstance().removeTimer(self.timerKey);
        self.changeState(StateMachineProxy.GAME3_IDLE);
    }
}
