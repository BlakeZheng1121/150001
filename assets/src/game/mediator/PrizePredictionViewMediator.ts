import { _decorator } from 'cc';
import { PrizePredictionView } from '../view/PrizePredictionView';
import BaseMediator from 'src/base/BaseMediator';
import { ReelEvent, SceneEvent, GameStateProxyEvent } from 'src/sgv3/util/Constant';
import { PrizePredictionCompleteCommand } from 'src/sgv3/command/reeleffect/PrizePredictionCompleteCommand';
const { ccclass } = _decorator;

@ccclass('PrizePredictionViewMediator')
export class PrizePredictionViewMediator extends BaseMediator<PrizePredictionView> {
    public static readonly NAME: string = 'PrizePredictionViewMediator';
    protected lazyEventListener(): void { }

    public listNotificationInterests(): Array<any> {
        return [
            ReelEvent.ON_REEL_PRIZE_PREDICTION,
            SceneEvent.LOAD_BASE_COMPLETE,
            GameStateProxyEvent.ON_SCENE_CHANGED];
    }

    public handleNotification(notification: puremvc.INotification): void {
        let name = notification.getName();
        switch (name) {
            case ReelEvent.ON_REEL_PRIZE_PREDICTION:
                this.view.play(() => this.onPrizePredictionComplete());
                break;
            case SceneEvent.LOAD_BASE_COMPLETE:
                this.view.node.active = true;
                break;
            case GameStateProxyEvent.ON_SCENE_CHANGED:
                this.view.setMaskSizeState(notification.getBody());
                break;
        }
    }

    onPrizePredictionComplete() {
        this.sendNotification(PrizePredictionCompleteCommand.NAME);
    }
}
