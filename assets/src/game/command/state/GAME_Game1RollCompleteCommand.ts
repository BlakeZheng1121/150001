import { Game1RollCompleteCommand } from '../../../sgv3/command/state/Game1RollCompleteCommand';
import { StateMachineProxy } from '../../../sgv3/proxy/StateMachineProxy';
import { GlobalTimer } from '../../../sgv3/util/GlobalTimer';
import { GameScene } from '../../../sgv3/vo/data/GameScene';
import { BaseGameResult } from '../../../sgv3/vo/result/BaseGameResult';

export class GAME_Game1RollCompleteCommand extends Game1RollCompleteCommand {
    protected timerKey = 'game1RollComplete';
    private isHitGrand: boolean = false;

    public execute(notification: puremvc.INotification): void {
        this.gameDataProxy.isSpinning = false;
        // 滾停，將 Web Spin 按鈕改變圖示
        this.webBridgeProxy.setElementStyle('spinBtn', 'stop', 'remove');
        // 進入Roll代表可以重置preScene為當前的Scene
        this.gameDataProxy.preScene = GameScene.Game_1;
        let curRoundResult = this.gameDataProxy.curRoundResult as BaseGameResult;

        // 判斷是否有特殊獎項
        this.isHitGrand = this.gameDataProxy.isHitGrand();

        // 延遲收集球的表演
        let delayTime: number = 0;
        let ballCount = curRoundResult.extendInfoForbaseGameResult.ballCount;
        if (ballCount >= 6 && this.isHitGrand == false) {
            delayTime = 2.6;
        } else if (ballCount > 0) {
            delayTime = 0.1;
        }
        GlobalTimer.getInstance().registerTimer(this.timerKey, delayTime, this.endGame1RollComplete, this).start();
    }

    private endGame1RollComplete() {
        GlobalTimer.getInstance().removeTimer(this.timerKey);
        if (this.isHitGrand) {
            this.changeState(StateMachineProxy.GAME1_HITSPECIAL);
        } else {
            this.changeState(StateMachineProxy.GAME1_BEFORESHOW);
        }
    }
}
