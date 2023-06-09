import { _decorator, Component, Prefab, Node } from 'cc';
import { ParticleContentTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
import { TimeLineTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
import { ScoreCollectHandler } from '../../game/view/ScoreCollectHandler';
import { AudioClipsEnum } from '../../game/vo/enum/SoundMap';
import { PoolManager } from '../../sgv3/PoolManager';
import { SpineTailPerform } from '../spine-trail-perform/SpineTailPerform';
import { AnimationTimeLineTool } from '../tool/animation-timeline-tool/AnimationTimeLineTool';
import { AudioManager } from '../tool/AudioManager';

const { ccclass, property } = _decorator;

@ccclass('JackPotPerformControl')
export class JackPotPerformControl extends Component {
    @property(SpineTailPerform) private DragonSpineTrailPerform: SpineTailPerform | null = null;

    @property(TimeLineTool) private JackpotAvatar: TimeLineTool | null = null;

    @property(ParticleContentTool) private transitionParticle: ParticleContentTool | null = null;

    @property private PerDargonHitValue: number = 0;

    @property({ type: Prefab, visible: true })
    public scorePrefab: Prefab | null = null;

    @property({ type: Node, visible: true })
    public effectTarget: Node | null = null;

    private DragonBallHitValue: number = 0;

    private DragonBallHitLV: number = 0;

    private DragonBallCurrentLV: number = 0;

    private _isJackPot: boolean = false;

    private TopCountNum: ScoreCollectHandler | null = null;

    //BaseGame打擊
    public BaseTrailPerform(spineDragonTrailAnimatID: number) {
        if (this._isJackPot == false) {
            this.DragonSpineTrailPerform?.UpdateAnimationObjectID(spineDragonTrailAnimatID);
            this.DragonSpineTrailPerform?.SpineTrailEffect();
            this.unschedule(this.OnDragonBallHit);
            this.scheduleOnce(this.OnDragonBallHit, 0.3);
        }
    }

    //清除BaseGame打擊行為所觸發的神燈動畫
    public ClearBaseTrailSchedule() {
        this.unschedule(this.OnDragonBallHit);
    }

    public FreeTrailPerform(spineDragonTrailAnimatID: number) {
        if (this._isJackPot == false) {
            this.DragonSpineTrailPerform?.UpdateAnimationObjectID(spineDragonTrailAnimatID);
            this.DragonSpineTrailPerform?.SpineFreeTrailEffect();
        }
    }

    private OnDragonBallHit() {
        if (this.DragonBallHitValue > 100) {
            this.DragonBallHitValue = 0;
        } else if (this._isJackPot == false) {
            this.DragonBallHitValue += this.PerDargonHitValue;

            this.DragonBallHitLV = this.DragonBallHitValue / 25;

            var DragonBallInt = Math.floor(this.DragonBallHitLV);

            this.JackpotAvatar?.play('Base_Hit_FX', () => this.OnDragonBallHitComplete());

            if (DragonBallInt != Math.floor(this.DragonBallCurrentLV)) {
                var lv = DragonBallInt - 1;
                if (lv < 0) {
                    lv = 0;
                }
            }
            this.DragonBallCurrentLV = this.DragonBallHitLV;
        }
    }

    private OnDragonBallHitComplete() {
        this.baseIdle();
    }

    public OnFreeGameBallHit() {
        this.JackpotAvatar?.play('Free_Hit_FX');
    }

    public OnHoldAndWinBallHit() {
        this.JackpotAvatar?.play('HW_Hit_FX');
    }

    //JackPotHit
    public JackPotHit(cb: any | null = null) {
        this.JackpotAvatar?.play('Mini_Transition');

        this.scheduleOnce(() => {
            AudioManager.Instance.play(AudioClipsEnum.Mini_DragonBreath);
        }, 0.5);
        this.scheduleOnce(() => {
            AudioManager.Instance.play(AudioClipsEnum.Mini_DragonBallExplosion);
        }, 1.0);

        this.scheduleOnce(() => {
            () => cb();
            this.transitionParticle?.ParticleClear();
        }, 5.3);

        this.scheduleOnce(() => {
            () => cb();
            this.MiniEntryTrail();
        }, 6);
    }

    private MiniEntryTrail() {
        for (let index = 0; index < 12; index++) {
            this.DragonSpineTrailPerform?.SpineMiniEffect(index);
        }
    }

    public OnScoreCollect(score: string, playType: number) {
        if (this.TopCountNum == null) {
            this.TopCountNum = PoolManager.instance
                .getNode(this.scorePrefab, this.effectTarget)
                .getComponent(ScoreCollectHandler);
        }
        this.TopCountNum.node.active = true;
        this.TopCountNum.onScoreCollect(score, playType);
    }

    public showBallCountInfo(count: string) {
        if (this.TopCountNum == null) {
            this.TopCountNum = PoolManager.instance
                .getNode(this.scorePrefab, this.effectTarget)
                .getComponent(ScoreCollectHandler);
        }
        this.TopCountNum.node.active = true;
        this.TopCountNum.ballCountUpdate(count);
    }

    public hideBallCountInfo() {
        if (this.TopCountNum != null) {
            this.TopCountNum.ballCountHide();
            this.TopCountNum.allFXClear();
            PoolManager.instance.putNode(this.TopCountNum.node);
            this.TopCountNum = null;
        }
    }

    public baseIdle() {
        this.JackpotAvatar?.play('Idle_NoBoard');
    }

    public fadeInBaseIdle() {
        this.JackpotAvatar?.play('Idle_NoBoard');
    }

    public freeIdle() {
        //this.JackpotAvatar?.play('Idle_Board');
    }

    public fallImmediately() {
        this.JackpotAvatar.node.active = false;
    }

    //** 結算分數加總 表演*/
    public dragonBallScoreSumShow() {
        if (this.TopCountNum != null) {
            this.TopCountNum.node.active = true;
            this.TopCountNum.onScoreSum();
        }

        if (this.TopCountNum != null) {
            this.scheduleOnce(() => {
                this.TopCountNum.allFXClear();
                PoolManager.instance.putNode(this.TopCountNum.node);
                this.TopCountNum = null;
            }, 3);
        }
    }
}
