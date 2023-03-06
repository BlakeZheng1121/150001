import { _decorator, Label, tween } from 'cc';
import { TimeLineTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
import { BaseScene } from '../../base/BaseScene';
import { BalanceUtil } from '../../sgv3/util/BalanceUtil';
import { GlobalTimer } from '../../sgv3/util/GlobalTimer';
import { MiniGameSymbol } from '../../sgv3/vo/enum/MiniGameSymbolType';
import { MiniResultBoard } from '../../ta/mini-result-board/MiniResultBoard';
import { AudioManager } from '../../ta/tool/AudioManager';
import { AudioClipsEnum, ScoringClipsEnum } from '../vo/enum/SoundMap';
const { ccclass, property } = _decorator;

@ccclass('GrandView')
export class GrandView extends BaseScene {
    @property(TimeLineTool)
    private anim: TimeLineTool;
    @property(MiniResultBoard)
    private miniResultBoard: MiniResultBoard;
    @property(Label)
    private scoreTxt: Label;
    private _score = 0;
    private canSkip = false;
    private skipFunction: Function;
    private canSkipScoringGrandTimerKey: string = 'canSkipScoringGrand';
    private callBackFunction: Function;

    public get score(): number {
        return this._score;
    }

    private set score(value: number) {
        this._score = value;
        this.scoreTxt.string = BalanceUtil.formatBalanceWithDollarSign(value);
    }
    private grandTime = 7; // 60s, Game_3_WinBoardViewMediator.getWinBoardRunTimer
    private bonusCanSkipRunCreditsTime = 5; //Game_3_WinBoardViewMediator.getWinBoardRunTimer

    onLoad() {
        super.onLoad('GrandViewMediator', `${this.node.parent.name}_GrandViewMediator`);
    }

    public showUp(_lang: string, callBack?: Function): void {
        let lang = _lang == 'en' ? 0 : 1;
        this.miniResultBoard.SetEffectType(MiniGameSymbol.Grand, lang);
        this.callBackFunction = callBack;

        this.score = 0;
        this.scheduleOnce(() => {
            AudioManager.Instance.play(AudioClipsEnum.JP_GrandHit);
        }, 0.75);
        /*GlobalTimer.getInstance().removeTimer('GrandJPLoop');
        GlobalTimer.getInstance()
            .registerTimer(
                'GrandJPLoop',
                7.8,
                () => {
                    AudioManager.Instance.play(ScoringClipsEnum.Scoring_JPWinLoop04).loop(true);
                    this.miniResultBoard.playWinCoinFall();
                },
                this
            )
            .start();*/

        this.anim.play('Show');
        this.miniResultBoard.OnBoardDelayPlay(() => this.showMiniResultBoard());
    }

    private showMiniResultBoard() {
        AudioManager.Instance.play(ScoringClipsEnum.Scoring_JPWin04).loop(false);
        this.miniResultBoard.playWinCoinFall();

        this.callBackFunction?.();
    }

    private setCanUseSkip() {
        this.canSkip = true;
    }

    public scoringGrand(grand: number = 10000, callBack?: Function): void {
        this.canSkip = false;
        GlobalTimer.getInstance().removeTimer(this.canSkipScoringGrandTimerKey);
        GlobalTimer.getInstance()
            .registerTimer(this.canSkipScoringGrandTimerKey, this.bonusCanSkipRunCreditsTime, this.setCanUseSkip, this)
            .start();

        const scoringTween = tween<GrandView>(this)
            .to(
                this.grandTime,
                { score: grand },
                {
                    onComplete: () => this.skipFunction()
                }
            )
            .start();
        this.skipFunction = () => {
            this.canSkip = false;
            scoringTween.stop();
            this.score = grand;

            this.miniResultBoard.stopWinCoinFall();

            AudioManager.Instance.stop(ScoringClipsEnum.Scoring_JPWinIntro);
            AudioManager.Instance.stop(ScoringClipsEnum.Scoring_JPWin04);
            AudioManager.Instance.play(ScoringClipsEnum.Scoring_JPWinEnd04);
            this.skipFunction = null;
            GlobalTimer.getInstance()
                .registerTimer(
                    'delayCloseBoardTimer',
                    1.5,
                    () => {
                        GlobalTimer.getInstance().removeTimer('delayCloseBoardTimer');
                        callBack?.();
                    },
                    this
                )
                .start();
        };
    }

    public closeBoard(callBack?: Function): void {
        this.miniResultBoard.OnBoardClose();
        callBack?.();
    }

    public skipScoring() {
        if (this.canSkip) {
            this.skipFunction?.();
        }
    }

    show() {
        this.anim.node.active = true;
    }

    hide() {
        this.anim.node.active = false;
    }
}
