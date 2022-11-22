import { _decorator } from 'cc';
import BaseMediator from '../../base/BaseMediator';
import { Orientation, SceneManager } from '../../core/utils/SceneManager';
import { PrizePredictionCompleteCommand } from '../../sgv3/command/reeleffect/PrizePredictionCompleteCommand';
import { ReelEvent, SceneEvent } from '../../sgv3/util/Constant';
import { PrizePredictionView } from '../view/PrizePredictionView';
const { ccclass } = _decorator;

@ccclass('PrizePredictionViewMediator')
export class PrizePredictionViewMediator extends BaseMediator<PrizePredictionView> {
    protected lazyEventListener(): void {}

    public listNotificationInterests(): Array<any> {
        return [
            ReelEvent.ON_REEL_PRIZE_PREDICTION,
            SceneManager.EV_ORIENTATION_HORIZONTAL,
            SceneManager.EV_ORIENTATION_VERTICAL,
            SceneEvent.LOAD_BASE_COMPLETE
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        let name = notification.getName();
        switch (name) {
            case ReelEvent.ON_REEL_PRIZE_PREDICTION:
                if (SceneManager.Orientation == Orientation.HORIZONTAL) {
                    this.view.playHorizontal(() => this.onPrizePredictionComplete());
                } else if (SceneManager.Orientation == Orientation.VERTICAL) {
                    this.view.playVertical(() => this.onPrizePredictionComplete());
                } else {
                    this.view.play(() => this.onPrizePredictionComplete());
                }
                break;
            case SceneManager.EV_ORIENTATION_VERTICAL:
            case SceneManager.EV_ORIENTATION_HORIZONTAL:
                if (this.view.isPlaying) {
                    this.view.stop();
                }
                break;
            case SceneEvent.LOAD_BASE_COMPLETE:
                this.view.node.active = true;
                break;
        }
    }

    onPrizePredictionComplete() {
        this.sendNotification(PrizePredictionCompleteCommand.NAME);
    }
}
