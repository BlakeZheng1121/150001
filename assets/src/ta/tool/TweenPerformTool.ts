
import { _decorator, Component, Node, systemEvent, SystemEvent, EventKeyboard, KeyCode, tween, CCFloat, CurveRange, Vec3, Tween } from 'cc';
import { ParticleContentTool } from './particle-tool/ParticleContentTool';
const { ccclass, property } = _decorator;

 
@ccclass('TweenPerformTool')
export class TweenPerformTool extends Component {
   
    @property({ type: Node, visible: true })
    private _targertObj: Node  | null = null;

    @property({ type: CCFloat, visible: true })
    private _duration: number = 0;

    @property({type: CurveRange ,visible: true})
    private _tweenCurve: CurveRange = new CurveRange();

    public startWorldPos: Vec3 = new Vec3();

    public onFinished: Function | null = null;

    public particle: ParticleContentTool | null = null;

    public tempTween: Tween<Node> | null = null;

    public onLoad() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.startWorldPos = new Vec3(this.node.worldPosition);
        this.particle = this.node.getComponent(ParticleContentTool);
    }


    private onKeyDown(event: EventKeyboard) {
        switch(event.keyCode){
            case KeyCode.NUM_0:
                this.onTriggerReset();
                break;
            case KeyCode.NUM_1:
                this.onTriggerTween();
                break;
        }
    }

    private onTriggerTween() {
        this.tempTween = tween(this.node).to(
            this._duration,
            {
                worldPosition: this._targertObj.worldPosition
            },
            { easing: (dt) => this._tweenCurve.spline.evaluate(dt) }
        ).call(() => {
            if(this.onFinished != null){
                this.onFinished();
            }
        }).start();

        if(this.particle != null) {
            this.particle.ParticlePlay();
        }
    }

    private onTriggerReset(){
        if(this.tempTween != null){
            this.tempTween.stop();
        }
        this.node.worldPosition = this.startWorldPos;
        if(this.particle != null) {
        this.particle.ParticleStop();
        this.particle.ParticleClear();
        }
    }
}