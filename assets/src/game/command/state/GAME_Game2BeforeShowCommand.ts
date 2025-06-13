import { _decorator, macro } from 'cc';
import { Game2BeforeShowCommand } from '../../../sgv3/command/state/Game2BeforeShowCommand';
import { ReelDataProxy } from '../../../sgv3/proxy/ReelDataProxy';
import { StateMachineProxy } from '../../../sgv3/proxy/StateMachineProxy';
import {
    FreeGameEvent,
    ReelEvent,
    ViewMediatorEvent,
} from '../../../sgv3/util/Constant';
import { GlobalTimer } from '../../../sgv3/util/GlobalTimer';
import { FreeGameOneRoundResult } from '../../../sgv3/vo/result/FreeGameOneRoundResult';
import { SymbolInfo } from '../../../sgv3/vo/info/SymbolInfo';
import { SymbolId } from '../../../sgv3/vo/enum/Reel';
import { ReelViewMediator } from '../../mediator/ReelViewMediator';
import { GAME_ReelView } from '../../view/GAME_ReelView';
const { ccclass } = _decorator;

@ccclass('GAME_Game2BeforeShowCommand')
export class GAME_Game2BeforeShowCommand extends Game2BeforeShowCommand {
    protected timerKey = 'game2BeforeShow';

    public execute(notification: puremvc.INotification): void {
        this.notifyWebControl();

        this.GAME_clearTimerKey(); //避免timer沒有清除的問題

        if (!this.playStackWild()) {
            this.afterStackWild();
        }
    }

    private beforeShow() {
        this.notifyWebControl();

        this.GAME_clearTimerKey();

        let freeGameOneRoundResult: FreeGameOneRoundResult = this.gameDataProxy
            .curRoundResult as FreeGameOneRoundResult;
        let sceneData = this.gameDataProxy.getSceneDataByName(this.gameDataProxy.curScene);

        //判斷fortuneLevel參數是否需要變動;
        if (
            this.gameDataProxy.lastFortuneLevel == null ||
            this.gameDataProxy.lastFortuneLevel != freeGameOneRoundResult.displayInfo.fortuneLevelType
        ) {
            this.gameDataProxy.lastFortuneLevel = freeGameOneRoundResult.displayInfo.fortuneLevelType;
            this.sendNotification(
                ViewMediatorEvent.FORTUNE_LEVEL_CHANGE,
                freeGameOneRoundResult.displayInfo.fortuneLevelType
            );
        }

        if (this.gameDataProxy.curWinData.totalAmount() > 0) {
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
        this.beforeShow();
    }
    
    private GAME_clearTimerKey() {
        GlobalTimer.getInstance().removeTimer(this.timerKey);
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
