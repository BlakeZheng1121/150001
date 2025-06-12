import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { macro } from 'cc';
import { ReelEvent, ViewMediatorEvent } from '../../util/Constant';
import { ReelDataProxy } from '../../proxy/ReelDataProxy';
import { SymbolInfo } from '../../vo/info/SymbolInfo';
import { SymbolId } from '../../vo/enum/Reel';
import { GlobalTimer } from '../../util/GlobalTimer';
import { ReelViewMediator } from '../../../game/mediator/ReelViewMediator';
import { GAME_ReelView } from '../../../game/view/GAME_ReelView';
import { FreeGameOneRoundResult } from '../../vo/result/FreeGameOneRoundResult';
import { StateCommand } from './StateCommand';

export class Game2BeforeShowCommand extends StateCommand {
    public static readonly NAME = StateMachineProxy.GAME2_EV_BEFORESHOW;

    protected timerKey = 'game2BeforeShow';

    public execute(notification: puremvc.INotification): void {
        this.notifyWebControl();

        this.clearTimerKey(); //避免timer沒有清除的問題

        if (!this.playStackWild()) {
            this.afterStackWild();
        }
    }

    private clearTimerKey() {
        GlobalTimer.getInstance().removeTimer(this.timerKey);
    }

    private playStackWild(): boolean {
        let infos: SymbolInfo[] = [];
        if (this.reelDataProxy.symbolFeature) {
            for (let x = 0; x < this.reelDataProxy.symbolFeature.length; x++) {
                for (let y = 0; y < this.reelDataProxy.symbolFeature[x].length; y++) {
                    if (this.reelDataProxy.symbolFeature[x][y].wildFlag > 0) {
                        infos.push({ x: x, y: y, sid: SymbolId.WILD });
                    }
                }
            }
        }
        if (infos.length > 0) {
            this.sendNotification(ReelEvent.SHOW_STACK_WILD, infos);
            GlobalTimer.getInstance()
                .registerTimer(this.timerKey, 0.1, this.checkStackWildFinish, this, macro.REPEAT_FOREVER)
                .start();
            return true;
        }
        return false;
    }

    private checkStackWildFinish() {
        if (!this.reelView.isSymbolPlaying()) {
            GlobalTimer.getInstance().removeTimer(this.timerKey);
            this.afterStackWild();
        }
    }

    private afterStackWild() {
        let freeGameOneRoundResult: FreeGameOneRoundResult = this.gameDataProxy.curRoundResult as FreeGameOneRoundResult;
        let sceneData = this.gameDataProxy.getSceneDataByName(this.gameDataProxy.curScene);

        if (
            this.gameDataProxy.lastFortuneLevel == null ||
            this.gameDataProxy.lastFortuneLevel != freeGameOneRoundResult.displayInfo.fortuneLevelType
        ) {
            this.gameDataProxy.lastFortuneLevel = freeGameOneRoundResult.displayInfo.fortuneLevelType;
            this.sendNotification(ViewMediatorEvent.FORTUNE_LEVEL_CHANGE, freeGameOneRoundResult.displayInfo.fortuneLevelType);
        }

        if (freeGameOneRoundResult.playerWin > 0) {
            this.changeState(StateMachineProxy.GAME2_SHOWWIN);
        } else {
            let stayTime = sceneData.noWinStayTime;
            GlobalTimer.getInstance()
                .registerTimer(
                    this.timerKey,
                    stayTime,
                    () => {
                        GlobalTimer.getInstance().removeTimer(this.timerKey);
                        this.changeState(StateMachineProxy.GAME2_END);
                    },
                    this
                )
                .start();
        }
    }

    protected _reelDataProxy: ReelDataProxy;
    protected get reelDataProxy(): ReelDataProxy {
        if (!this._reelDataProxy) {
            this._reelDataProxy = this.facade.retrieveProxy(ReelDataProxy.NAME) as ReelDataProxy;
        }
        return this._reelDataProxy;
    }

    protected _reelView: GAME_ReelView;
    protected get reelView(): GAME_ReelView {
        if (!this._reelView) {
            const mediator = this.facade.retrieveMediator(ReelViewMediator.NAME) as ReelViewMediator;
            this._reelView = mediator.getViewComponent() as GAME_ReelView;
        }
        return this._reelView;
    }
}
