import { ViewMediatorEvent } from 'src/sgv3/util/Constant';
import { Game1RollCompleteCommand } from '../../../sgv3/command/state/Game1RollCompleteCommand';
import { StateMachineProxy } from '../../../sgv3/proxy/StateMachineProxy';
import { GlobalTimer } from '../../../sgv3/util/GlobalTimer';
import { GameScene } from '../../../sgv3/vo/data/GameScene';
import { BaseGameResult } from '../../../sgv3/vo/result/BaseGameResult';
import { SymbolId } from 'src/sgv3/vo/enum/Reel';

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
        let emblemLevel = (this.gameDataProxy.curEmblemLevel = this.getEmblemLevel());
        // 判斷是否有意象物升階表演
        this.sendNotification(ViewMediatorEvent.UPDATE_EMBLEM_LEVEL, emblemLevel);

        // 判斷是否有特殊獎項
        this.isHitGrand = this.gameDataProxy.isHitGrand();

        // 延遲收集球的表演
        let delayTime: number = 0;
        let ballCount = curRoundResult.extendInfoForbaseGameResult.ballCount;
        if (ballCount >= 6 && this.isHitGrand == false) {
            delayTime = 2;
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

    private getEmblemLevel(): number[] {
        let level: number[] = [];
        let curRoundResult = this.gameDataProxy.curRoundResult as BaseGameResult;
        let curLevel = (level[0] = this.gameDataProxy.curEmblemLevel[0] ? this.gameDataProxy.curEmblemLevel[0] : 0);
        if (this.hasSymbolC1(curRoundResult)) {
            try {
                curLevel = this.gameDataProxy.getLevelMapping(
                    curRoundResult.extendInfoForbaseGameResult.seatInfo.statusAccumulation[0]
                );
            } catch (error) {
                // TEST: 後端沒帶資料時，隨機取得一個等級
                curLevel = Math.random() < 0.5 ? Math.min(curLevel + 1, 3) : curLevel;
            }
        }
        level[0] = curLevel;
        return level;
    }

    private hasSymbolC1(curRoundResult: BaseGameResult) {
        let hasC1 = false;
        for (let i = 0; i < curRoundResult.screenSymbol.length; i++) {
            for (let j = 0; j < curRoundResult.screenSymbol[i].length; j++) {
                if (curRoundResult.screenSymbol[i][j] == SymbolId.C1) {
                    hasC1 = true;
                    break;
                }
            }
        }
        return hasC1;
    }
}
