import { _decorator, macro } from 'cc';
import { Game2BeforeShowCommand } from '../../../sgv3/command/state/Game2BeforeShowCommand';
import { ReelDataProxy } from '../../../sgv3/proxy/ReelDataProxy';
import { StateMachineProxy } from '../../../sgv3/proxy/StateMachineProxy';
import { FreeGameEvent, ReelEvent, ViewMediatorEvent } from '../../../sgv3/util/Constant';
import { GlobalTimer } from '../../../sgv3/util/GlobalTimer';
import { Logger } from '../../../core/utils/Logger';
import { SymbolInfo } from '../../../sgv3/vo/info/SymbolInfo';
import { SymbolId } from '../../../sgv3/vo/enum/Reel';
import { FreeGameOneRoundResult } from '../../../sgv3/vo/result/FreeGameOneRoundResult';
const { ccclass } = _decorator;

@ccclass('GAME_Game2BeforeShowCommand')
export class GAME_Game2BeforeShowCommand extends Game2BeforeShowCommand {
    protected timerKey = 'game2BeforeShow';

    public execute(notification: puremvc.INotification): void {
        Logger.i('[GAME_Game2BeforeShowCommand] execute');
        this.notifyWebControl();

        this.GAME_clearTimerKey(); // 避免timer沒有清除的問題

        const startFlow = () => {
            if (!this.playStackWild()) {
                this.afterStackWild();
            }
        };

        if (this.isBallScoreShow() || this.isWildShow()) {
            this.sendNotification(FreeGameEvent.ON_SIDE_BALL_SCORE_SHOW, startFlow);
        } else {
            startFlow();
        }
    }

    private playStackWild(): boolean {
        let infos: SymbolInfo[] = [];
        let wildFlags: number[][] = [];
        if (this.reelDataProxy.symbolFeature) {
            for (let x = 0; x < this.reelDataProxy.symbolFeature.length; x++) {
                wildFlags[x] = [];
                for (let y = 0; y < this.reelDataProxy.symbolFeature[x].length; y++) {
                    const flag = this.reelDataProxy.symbolFeature[x][y].wildFlag;
                    wildFlags[x][y] = flag;
                    if (flag > 0) {
                        infos.push({ x: x, y: y, sid: SymbolId.WILD });
                    }
                }
            }
        }

        Logger.i(`[Game2] wildFlag = ${JSON.stringify(wildFlags)}`);

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
    private GAME_clearTimerKey() {
        GlobalTimer.getInstance().removeTimer(this.timerKey);
    }

    // 取得 角落球、retrigger、wild 表演資訊flag

    private isBallScoreShow() {
        let freeGameOneRoundResult = this.gameDataProxy.curRoundResult as FreeGameOneRoundResult;
        let sideCreditBall: Array<Array<number>> =
            freeGameOneRoundResult.extendInfoForFreeGameResult.sideCreditBallScreenLabel;
        for (let i = 0; i < sideCreditBall.length; i++) {
            for (let j = 0; j < sideCreditBall[i].length; j++) {
                if (sideCreditBall[i][j] > 0) {
                    return true;
                }
            }
        }
    }

    private isWildShow() {
        let freeGameOneRoundResult = this.gameDataProxy.curRoundResult as FreeGameOneRoundResult;

        // 判斷是否有wild加倍
        if (freeGameOneRoundResult.waysGameResult.waysResult.length > 0) {
            for (let i = 0; i < freeGameOneRoundResult.screenSymbol[2].length; i++) {
                if (freeGameOneRoundResult.screenSymbol[2][i] == 0) {
                    return true;
                }
            }
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
