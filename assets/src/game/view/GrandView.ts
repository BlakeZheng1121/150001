import { _decorator, Label, SystemEvent, tween } from 'cc';
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

    private skipFunction: Function;
    // callback
    public buttonCallback: IGrandViewMediator = null;

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
        this.scheduleOnce(() => {
            this.callBackFunction?.();
        }, 4.3);
    }

    private showMiniResultBoard() {
        AudioManager.Instance.play(ScoringClipsEnum.Scoring_JPWin04).loop(false);
        this.miniResultBoard.playWinCoinFall();
    }

    public scoringGrand(grand: number = 10000, callBack?: Function): void {
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
            scoringTween.stop();
            this.score = grand;

            this.miniResultBoard.stopWinCoinFall();

            AudioManager.Instance.stop(ScoringClipsEnum.Scoring_JPWinIntro);
            AudioManager.Instance.stop(ScoringClipsEnum.Scoring_JPWin04);
            AudioManager.Instance.play(ScoringClipsEnum.Scoring_JPWinEnd04);
            callBack?.();
            this.skipFunction = null;
        };
        this.registerButton();
    }

    public closeBoard(callBack?: Function): void {
        this.unregisterButton();
        GlobalTimer.getInstance()
            .registerTimer(
                'closeBoardTimer',
                2,
                () => {
                    GlobalTimer.getInstance().removeTimer('closeBoardTimer');
                    this.miniResultBoard.OnBoardClose();
                    callBack?.();
                },
                this
            )
            .start();
    }

    public skipScoring() {
        this.skipFunction?.();
    }

    show() {
        this.anim.node.active = true;
    }

    hide() {
        this.anim.node.active = false;
    }

    public registerButton() {
        this.node.on(
            SystemEvent.EventType.TOUCH_END,
            () => {
                this.buttonCallback.onSkip();
            },
            this.buttonCallback
        );
    }

    public unregisterButton() {
        this.node.off(SystemEvent.EventType.TOUCH_END);
    }
}
export interface IGrandViewMediator {
    onSkip();
}
