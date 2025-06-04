import { StateMachineProxy } from '../../proxy/StateMachineProxy';
import { macro } from 'cc';
import { ReelEvent, ViewMediatorEvent } from '../../util/Constant';
import { ReelDataProxy } from '../../proxy/ReelDataProxy';
import { SymbolInfo } from '../../vo/info/SymbolInfo';
import { SymbolId } from '../../vo/enum/Reel';
import { GlobalTimer } from '../../util/GlobalTimer';
import { ReelViewMediator } from '../../../game/mediator/ReelViewMediator';
import { GAME_ReelView } from '../../../game/view/GAME_ReelView';
import { BaseGameResult } from '../../vo/result/BaseGameResult';
import { StateCommand } from './StateCommand';

export class Game1BeforeShowCommand extends StateCommand {
    public static readonly NAME = StateMachineProxy.GAME1_EV_BEFORESHOW;

    protected timerKey = 'game1BeforeShow';

    public execute(notification: puremvc.INotification): void {
        this.notifyWebControl();

        this.clearTimerKey(); //避免 timer沒有清除的問題

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
                .registerTimer(
                    this.timerKey,
                    0.1,
                    this.checkStackWildFinish,
                    this,
                    macro.REPEAT_FOREVER
                )
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
        let baseGameResult: BaseGameResult = this.gameDataProxy.curRoundResult as BaseGameResult;
        if (
            this.gameDataProxy.lastFortuneLevel == null ||
            this.gameDataProxy.lastFortuneLevel != baseGameResult.displayInfo.fortuneLevelType
        ) {
            this.gameDataProxy.lastFortuneLevel = baseGameResult.displayInfo.fortuneLevelType;
            this.sendNotification(ViewMediatorEvent.FORTUNE_LEVEL_CHANGE, baseGameResult.displayInfo.fortuneLevelType);
        }

        let nextState =
            baseGameResult.baseGameTotalWin > 0 || this.gameDataProxy.isHitSpecial()
                ? StateMachineProxy.GAME1_SHOWWIN
                : StateMachineProxy.GAME1_END;

        this.changeState(nextState);
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
            const mediator = this.facade.retrieveMediator(
                ReelViewMediator.NAME
            ) as ReelViewMediator;
            this._reelView = mediator.getViewComponent() as GAME_ReelView;
        }
        return this._reelView;
    }
}
