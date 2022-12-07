import { _decorator, Label, tween, Vec3, Prefab } from 'cc';
import { ParticleContentTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
import { BaseScene } from '../../base/BaseScene';
import { PoolManager } from '../../sgv3/PoolManager';
import { BalanceUtil } from '../../sgv3/util/BalanceUtil';
import { GlobalTimer } from '../../sgv3/util/GlobalTimer';
import { AnimationTimeLineTool } from '../../ta/tool/animation-timeline-tool/AnimationTimeLineTool';
import { AudioManager } from '../../ta/tool/AudioManager';
import { AudioClipsEnum, BGMClipsEnum, ScoringClipsEnum } from '../vo/enum/SoundMap';
const { ccclass, property } = _decorator;

@ccclass('GrandView')
export class GrandView extends BaseScene {
    @property(AnimationTimeLineTool)
    private anim: AnimationTimeLineTool;
    @property({ type: Prefab })
    public particlePrefab: Prefab | null = null;
    @property(Label)
    private scoreTxt: Label;
    private _score = 0;
    private canSkip = false;
    private skipFunction: Function;
    private canSkipScoringGrandTimerKey: string = 'canSkipScoringGrand';

    public get score(): number {
        return this._score;
    }

    private set score(value: number) {
        this._score = value;
        this.scoreTxt.string = BalanceUtil.formatBalanceWithDollarSign(value);
    }
    private grandTime = 60; //Game_3_WinBoardViewMediator.getWinBoardRunTimer
    private bonusCanSkipRunCreditsTime = 5; //Game_3_WinBoardViewMediator.getWinBoardRunTimer

    onLoad() {
        super.onLoad('GrandViewMediator', `${this.node.parent.name}_GrandViewMediator`);
    }

    public showUp(curScene: string, callBack?: Function): void {
        this.score = 0;
        GlobalTimer.getInstance().removeTimer('GrandJPAudio');
        GlobalTimer.getInstance()
            .registerTimer(
                'GrandJPAudio',
                4,
                () => {
                    AudioManager.Instance.play(AudioClipsEnum.JP_GrandHit);
                },
                this
            )
            .start();
        GlobalTimer.getInstance().removeTimer('GrandJPLoop');
        GlobalTimer.getInstance()
            .registerTimer(
                'GrandJPLoop',
                6.5,
                () => {
                    switch (curScene) {
                        case 'Game_1':
                            AudioManager.Instance.fade(BGMClipsEnum.BGM_Base, 0, 0.7);
                            break;
                        case 'Game_2':
                            AudioManager.Instance.fade(BGMClipsEnum.BGM_FreeGame, 0, 0.7);
                            break;
                        case 'Game_4':
                            AudioManager.Instance.fade(BGMClipsEnum.BGM_DragonUp, 0, 0.7);
                            break;
                    }
                    AudioManager.Instance.play(ScoringClipsEnum.Scoring_JPWinLoop).loop(true);
                },
                this
            )
            .start();

        this.anim.OnPlay(0, () => callBack());
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

        const coinFall = PoolManager.instance
            .getNode(this.particlePrefab, this.node)
            .getComponent(ParticleContentTool);

        coinFall.ParticlePlay();

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

            coinFall.ParticleStop();
            this.scheduleOnce(() => {
            PoolManager.instance.putNode(coinFall.node);
            }, coinFall.PutPoolTimes);

            AudioManager.Instance.stop(ScoringClipsEnum.Scoring_JPWinIntro);
            AudioManager.Instance.stop(ScoringClipsEnum.Scoring_JPWinLoop);
            AudioManager.Instance.play(ScoringClipsEnum.Scoring_JPWinEnd);
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
        this.anim.OnPlay(1, () => callBack?.());
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
