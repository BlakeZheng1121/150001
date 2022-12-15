import { _decorator, Component, Label, Prefab, Node } from 'cc';
import { ParticleContentTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
import { TimeLineTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
import { PoolManager } from '../../sgv3/PoolManager';

const { ccclass, property } = _decorator;

@ccclass('DragonBallPerform')
export class DragonBallPerform extends Component {
    @property(TimeLineTool) private DragonBallFxAnimation: TimeLineTool | null = null;

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

        this.DragonBallFxAnimation?.play('Idle_NoBoard');
    }

    public OnDragonBallHit(Lv: number) {
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
        this.DragonBallFxAnimation?.play('Mini_Transition');

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
        this.DragonBallFxAnimation?.play('Idle_NoBoard');
    }

    public OnBallHide() {
        this.DragonBallFxAnimation.node.active = false;
    }

    public OnBaseIdle() {
        this.DragonBallFxAnimation?.play('Idle_NoBoard');
    }

    public OnHoldSpinIdle() {
        this.DragonBallFxAnimation?.play('Idle_Board');
    }

    public onHoldSpinEnd(){
        this.DragonBallFxAnimation?.play('Idle_Collect');
    }

    public OnFreeIdle() {
        this.DragonBallFxAnimation?.play('Idle_Board');
    }
}
