
import { _decorator, Component, Label, Font, Sprite, TweenEasing, CCFloat, CCInteger, Vec3, Animation } from 'cc';
import { UIOrientation } from '../../../core/ui/UIOrientation';
import { BalanceUtil } from '../../../sgv3/util/BalanceUtil';
import { CocosAnimationMultiTool } from '../../../ta/tool/cocos-animation-tool/CocosAnimationMultiTool';
import { ParticleContentTool } from '../../../ta/tool/particle-tool/ParticleContentTool';
const { ccclass, property } = _decorator;
 
@ccclass('PosTweenObject')
export class PosTweenObject extends Component {
    @property({ type: Label, visible: true })
    public labelText: Label | null = null;
    @property({ type: Sprite, visible: true })
    public mainSprite: Sprite | null = null;
    @property({ type: Font, visible: true })
    public baseFont: Font | null = null;
    @property({ type: Font, visible: true })
    public specialFont: Font | null = null;
    @property({ type: Font, visible: true })
    public multipleFont: Font | null = null;
    @property(CocosAnimationMultiTool)
    public Animation: CocosAnimationMultiTool|null = null;
    @property({ type: [ParticleContentTool], visible: true })
    public Particle: Array<ParticleContentTool> = [];

    @property({group: { name: "baseCredit" }, type: CCFloat, visible: true })
    public baseCreditTime: number = 0;
    @property({group: { name: "baseCredit" }, visible: true })
    public baseCreditEasing: TweenEasing = "fade";

    @property({group: { name: "accelerateMutiple" }, type: CCFloat, visible: true })
    public accelerateDelayTime: number = 0;
    @property({group: { name: "accelerateMutiple" }, type: CCInteger, visible: true })
    public acceleratePtCount: number = 0;
    @property({group: { name: "accelerateMutiple" }, type: CCFloat, visible: true })
    public accelerateTimeBase: number = 0;

    @property({group: { name: "getResult" }, type: CCInteger, visible: true })
    public getResultPtCount: number = 0;
    @property({group: { name: "getResult" }, type: CCFloat, visible: true })
    public getResultTimeBase: number = 0;

    private _uiOrientation: UIOrientation | null = null;

    public get uiOrientation(){
        if(this._uiOrientation == null){
            this._uiOrientation = this.getComponent(UIOrientation);
        }
        return this._uiOrientation;
    }


    public setBaseCreditSetting(isSpecial: boolean,credit: number){
        this.mainSprite.enabled = true;
        this.Animation.OnPlay(0);
        this.labelText.string = String();
        this.labelText.font = (isSpecial) ? this.specialFont : this.baseFont;
        this.labelText.string = BalanceUtil.formatBalanceWithExpressingUnits(credit);
    }

    public setMultipleSetting(multiple: number){
        this.anim.stop();
        this.labelText.node.scale = Vec3.ONE;
        this.mainSprite.enabled = false;
        this.Animation.OnPlay(2);
        this.labelText.string = String();
        this.labelText.font = this.multipleFont;
        this.labelText.string = String(multiple+"%");
    }

    private _anim : Animation;
    private get anim() : Animation{
        if(!this._anim) {
            this._anim = this.node.getComponent(Animation);
        }
        return this._anim;
    }
}