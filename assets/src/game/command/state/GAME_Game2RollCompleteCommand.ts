import { _decorator, Vec3, macro } from 'cc';
import { ReelDataProxy } from '../../../sgv3/proxy/ReelDataProxy';
import { StateMachineProxy } from '../../../sgv3/proxy/StateMachineProxy';
import { FreeGameEvent, ReelEvent } from '../../../sgv3/util/Constant';
import { GlobalTimer } from '../../../sgv3/util/GlobalTimer';
import { GameScene } from '../../../sgv3/vo/data/GameScene';
import { FreeGameOneRoundResult } from '../../../sgv3/vo/result/FreeGameOneRoundResult';
import { SymbolInfo } from '../../../sgv3/vo/info/SymbolInfo';
import { SymbolId } from '../../../sgv3/vo/enum/Reel';
import { WAY_Game2RollCompleteCommand } from '../../../sgv3way/command/state/WAY_Game2RollCompleteCommand';
import { FreeGameSpecialInfo } from '../../vo/FreeGameSpecialInfo';
import { ReelViewMediator } from '../../mediator/ReelViewMediator';
import { GAME_ReelView } from '../../view/GAME_ReelView';
const { ccclass } = _decorator;

@ccclass('GAME_Game2RollCompleteCommand')
export class GAME_Game2RollCompleteCommand extends WAY_Game2RollCompleteCommand {
    private freeGameSpecialInfo: FreeGameSpecialInfo;

    readonly timeKey_sideBallShow = 'timeKey_sideBallShow';
    readonly sideBallShowTimeOut = 0.5;

    readonly timeKey_sideBallShowAfter = 'timeKey_sideBallShowAfter';
    readonly sideBallAfterTimeOut = 0.3;

    readonly timeKey_sideBallShowEnd = 'timeKey_sideBallShowEnd';
    readonly sideBallShowEndTimeOut = 1;

    readonly timeKey_mystery = 'timeKey_mystery';
    readonly mysteryShowEndTimeOut = 1.5;

    public execute(notification: puremvc.INotification): void {
        //super.execute(notification);
        this.notifyWebControl();

        // 進入Roll代表可以重置preScene為當前的Scene
        this.gameDataProxy.preScene = GameScene.Game_2;

        let freeGameSpecialInfo: FreeGameSpecialInfo = this.getSpecialInfo();
        this.freeGameSpecialInfo = freeGameSpecialInfo;

        if (!this.playMystery()) {
            this.nextState();
        }
    }

    private nextState() {
        GlobalTimer.getInstance().removeTimer(this.timeKey_sideBallShowEnd);
        if (this.freeGameSpecialInfo.retrigger.isRetrigger || this.freeGameSpecialInfo.isHitGrand) {
            this.changeState(StateMachineProxy.GAME2_HITSPECIAL, this.freeGameSpecialInfo);
        } else {
            this.changeState(StateMachineProxy.GAME2_BEFORESHOW);
        }
    }

    private playMystery(): boolean {
        let posInfos: Array<Vec3> = new Array<Vec3>();
        const screen = (this.gameDataProxy.curRoundResult as FreeGameOneRoundResult).screenSymbol;
        if (screen) {
            for (let x = 0; x < screen.length; x++) {
                for (let y = 0; y < screen[x].length; y++) {
                    if (screen[x][y] === SymbolId.MY) {
                        posInfos.push(this.reelDataProxy.getFovLocalPos(x, y));
                    }
                }
            }
        }
        if (posInfos.length > 0) {
            this.sendNotification(FreeGameEvent.SHOW_MYSTERY, posInfos);

            GlobalTimer.getInstance()
                .registerTimer(
                    this.timeKey_mystery,
                    this.mysteryShowEndTimeOut,
                    () => {
                        GlobalTimer.getInstance().removeTimer(this.timeKey_mystery);
                        this.nextState();
                    },
                    this
                )
                .start();

            return true;
        }
        return false;
    }

    // 取得 特色 表演資訊
    private getSpecialInfo() {
        let freeGameOneRoundResult = this.gameDataProxy.curRoundResult as FreeGameOneRoundResult;

        let sideCreditBall: Array<Array<number>> =
            freeGameOneRoundResult.extendInfoForFreeGameResult.sideCreditBallScreenLabel;

        let sideCreditBallPos: Array<Array<Vec3>> = new Array();

        let freeGameSpecialInfo: FreeGameSpecialInfo = new FreeGameSpecialInfo();

        // 判斷是否有retrigger
        freeGameSpecialInfo.retrigger.isRetrigger = freeGameOneRoundResult.extendInfoForFreeGameResult.isRetrigger;
        freeGameSpecialInfo.retrigger.addRound = freeGameOneRoundResult.roundInfo.addRound;

        // 判斷是否有角落球
        for (let i = 0; i < sideCreditBall.length; i++) {
            sideCreditBallPos[i] = new Array();
            for (let j = 0; j < sideCreditBall[i].length; j++) {
                if (sideCreditBall[i][j] > 0) {
                    freeGameSpecialInfo.hitBall.isShowHitBall = true;
                    sideCreditBall[i][j] = this.gameDataProxy.convertCredit2Cash(sideCreditBall[i][j]);
                    if (this.gameDataProxy.isOmniChannel()) {
                        sideCreditBall[i][j] = this.gameDataProxy.getCreditByDenomMultiplier(sideCreditBall[i][j]);
                    }
                }
                sideCreditBallPos[i].push(this.reelDataProxy.getFovLocalPos(i, j));
            }
        }

        freeGameSpecialInfo.hitBall.sideCreditBall = sideCreditBall;
        freeGameSpecialInfo.hitBall.sideCreditBallPos = sideCreditBallPos;

        // 判斷是否有特殊獎項 Mystery Grand
        freeGameSpecialInfo.isHitGrand = this.gameDataProxy.isHitGrand();

        return freeGameSpecialInfo;
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
