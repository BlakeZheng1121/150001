import { Vec2 } from 'cc';
import { Game1FeatureSelectionCommand } from '../../../sgv3/command/state/Game1FeatureSelectionCommand';
import { ViewMediatorEvent } from '../../../sgv3/util/Constant';

export class GAME_Game1FeatureSelectionCommand extends Game1FeatureSelectionCommand {
    public execute(notification: puremvc.INotification): void {
        this.gameDataProxy.hasSelectionResponse = false;
        this.sendNotification(ViewMediatorEvent.PREPARE_COLLECT_BALL);
        this.endGame1FeatureSelection();
    }

    private endGame1FeatureSelection() {
        let ballHitInfo = this.gameDataProxy.spinEventData.baseGameResult.extendInfoForbaseGameResult;
        let baseArray = new Array<Vec2>();
        for (let x = 0; x < ballHitInfo.ballScreenLabel.length; x++) {
            for (let y = 0; y < ballHitInfo.ballScreenLabel[x].length; y++) {
                if (ballHitInfo.ballScreenLabel[x][y] > 0) {
                    baseArray.push(new Vec2(x, y));
                }
            }
        }
        // Base game 龍珠分數收集
        this.sendNotification(ViewMediatorEvent.ON_CREDIT_BALL_COLLECT_START, baseArray);
    }
}
