import { _decorator, Component, Prefab, Vec3 } from 'cc';
import { ScoreCollectHandler } from '../../game/view/ScoreCollectHandler';
import { PoolManager } from '../../sgv3/PoolManager';
import { GameScene } from '../../sgv3/vo/data/GameScene';
import { DragonBallPerform } from '../dragon-ball-perform/DragonBallPerform';
import { SpineTailPerform } from '../spine-trail-perform/SpineTailPerform';

const { ccclass, property } = _decorator;

@ccclass('JackPotPerformControl')
export class JackPotPerformControl extends Component {
    @property(DragonBallPerform) private DragonBallPerform: DragonBallPerform | null = null;

    @property(SpineTailPerform) private DragonSpineTrailPerform: SpineTailPerform | null = null;

    @property private PerDargonHitValue: number = 0;

    @property({ type: Prefab, visible: true })
    public scorePrefab: Prefab | null = null;

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
            this.scheduleOnce(this.OnDragonBallHit, 0.85);
        }
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

            this.DragonBallPerform?.OnDragonBallHit(this.DragonBallHitLV);

            if (DragonBallInt != Math.floor(this.DragonBallCurrentLV)) {
                var lv = DragonBallInt - 1;
                if (lv < 0) {
                    lv = 0;
                }

                //this.DragonCoinPerform?.DragonCoinSpineLVControl();
            }
            this.DragonBallCurrentLV = this.DragonBallHitLV;
        }
    }

    //JackPotHit
    public JackPotHit(cb: any | null = null) {
        //this.DragonCoinPerform?.DragonCoinSpineToMini();
        this.DragonBallPerform?.OnJackPotReady();

        this.scheduleOnce(() => {
            // this.DragonCoinPerform?.DragonCoinFall();

            this.DragonBallPerform?.OnJackPotHit();
        }, 4.3);

        this.scheduleOnce(() => {
            this.MiniEntryTrail();
        }, 4.6);

        this.scheduleOnce(() => {
            () => cb();
        }, 10);
    }

    private MiniEntryTrail() {
        this.DragonSpineTrailPerform?.SpineMiniTransitionPerform();
        /*for (let index = 0; index < 12; index++) {
            this.DragonSpineTrailPerform?.SpineMiniEffect(index);
        }*/
    }

    public DragonBallInit() {
        this.DragonBallPerform?.OnBallInit();
    }

    /*public DragonCoinInit() {
        this.DragonCoinPerform?.DragonCoinSpineInit();
    }*/

    public OnScoreCollect(score: string, playType: number, gameScene: GameScene = GameScene.Game_1) {
        if (this.TopCountNum == null) {
            this.TopCountNum = PoolManager.instance
                .getNode(this.scorePrefab, this.DragonBallPerform.node)
                .getComponent(ScoreCollectHandler);
        }
        this.TopCountNum.node.position = new Vec3(0, 187, 0);
        this.TopCountNum.node.active = true;
        this.TopCountNum.onScoreCollect(score, playType);
    }

    public showBallCountInfo(count: string) {
        if (this.TopCountNum == null) {
            this.TopCountNum = PoolManager.instance
                .getNode(this.scorePrefab, this.DragonBallPerform.node)
                .getComponent(ScoreCollectHandler);
        }
        this.TopCountNum.node.active = true;
        this.TopCountNum.node.position = new Vec3(0, -10, 0);
        this.TopCountNum.ballCountUpdate(count);
    }

    public hideBallCountInfo() {
        if (this.TopCountNum != null) {
            this.TopCountNum.ballCountHide();
            this.TopCountNum.allFXClear();
            PoolManager.instance.putNode(this.TopCountNum.node);
            this.TopCountNum = null;
        }
        this.DragonBallPerform?.onHoldSpinEnd();
    }

    public DragonBallHide() {
        this.DragonBallPerform?.OnBallInit();
    }

    public DragonBallBaseIdle() {
        this.DragonBallPerform?.OnBaseIdle();
    }

    public DragonBallFreeIdle() {
        this.DragonBallPerform?.OnFreeIdle();
    }

    public holdSpinIdle() {
        this.DragonBallPerform?.OnHoldSpinIdle();
    }

    /*public DragonCoinHide() {
        this.DragonCoinPerform?.DragonCoinHide();
    }*/

    public DragonBallFallImmediately() {
        this.DragonBallPerform?.OnBallHide();
    }

    //** 結算分數加總 表演*/
    public dragonBallScoreSumShow() {
        if (this.TopCountNum != null) {
            this.TopCountNum.node.active = true;
            this.TopCountNum.onScoreSum();
        }

        this.scheduleOnce(() => {
            this.TopCountNum.allFXClear();
            PoolManager.instance.putNode(this.TopCountNum.node);
            this.TopCountNum = null;
        }, 3);
    }
}
