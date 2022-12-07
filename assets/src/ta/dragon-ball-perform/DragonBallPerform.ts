import { _decorator, Component, Label, Prefab, Node } from 'cc';
import { ParticleContentTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
import { PoolManager } from '../../sgv3/PoolManager';

import { CocosAnimationMultiTool } from '../tool/cocos-animation-tool/CocosAnimationMultiTool';

const { ccclass, property } = _decorator;

@ccclass('DragonBallPerform')
export class DragonBallPerform extends Component {
    @property(CocosAnimationMultiTool) private DragonBallFxAnimation: CocosAnimationMultiTool | null = null;

    //@property({ type: Node, visible: true })
    //public dragon: Node | null = null;

    @property({ type: Prefab, visible: true })
    public ballEffect01Prefab: Prefab | null = null;

    @property({ type: Prefab, visible: true })
    public ballEffect02Prefab: Prefab | null = null;

    @property({ type: Prefab, visible: true })
    public EffectFirePointPrefab: Prefab | null = null;

    private IsAnimatPlay: boolean = false;

    private IsJackPotHit: boolean = false;

    start() {
        this.IsAnimatPlay = false;

        this.DragonBallFxAnimation?.OnPlay(0);
    }

    public OnDragonBallHit(Lv: number) {
        if (this.IsJackPotHit == false) {
            this.DragonBallFxAnimation?.OnPlay(0);
        }

        if (this.IsAnimatPlay == false) {
            this.IsAnimatPlay = true;
        }
    }

    public OnJackPotReady() {
        this.IsJackPotHit = true;

        let particle01: ParticleContentTool = PoolManager.instance
            .getNode(this.ballEffect01Prefab, this.node)
            .getComponent(ParticleContentTool);

        let particle02: ParticleContentTool = PoolManager.instance
            .getNode(this.ballEffect02Prefab, this.node)
            .getComponent(ParticleContentTool);

        particle02.ParticlePlay();
        particle01.ParticlePlay();
        this.DragonBallFxAnimation?.OnPlay(0);
        this.DragonBallFxAnimation?.OnPlay(4);

        this.scheduleOnce(() => {
            PoolManager.instance.putNode(particle01.node);
            PoolManager.instance.putNode(particle02.node);
        }, particle02.PutPoolTimes);
    }

    public OnJackPotHit() {
        this.IsJackPotHit = false;

        this.IsAnimatPlay = false;
    }

    public OnBallInit() {
        this.DragonBallFxAnimation?.OnPlay(0);
    }

    public OnBallHide() {
        this.DragonBallFxAnimation.node.active = false;
    }

    public OnBaseIdle() {
        this.DragonBallFxAnimation?.OnPlay(0);
    }

    public OnHoldSpinIdle() {
        this.DragonBallFxAnimation?.OnPlay(1);
    }

    public onHoldSpinEnd(){
        this.DragonBallFxAnimation?.OnPlay(2);
    }

    public OnFreeIdle() {
        this.DragonBallFxAnimation?.OnPlay(3);
    }
}
