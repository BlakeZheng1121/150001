import { _decorator, Component, Color, Sprite, SpriteFrame } from 'cc';

import { CocosAnimationMultiTool } from '../tool/cocos-animation-tool/CocosAnimationMultiTool';
import { ParticleContentTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';

const { ccclass, property } = _decorator;

@ccclass('MiniIngot')
export class MiniIngot extends Component {
    @property(CocosAnimationMultiTool) private IngotAnimation: CocosAnimationMultiTool | null = null;

    @property(CocosAnimationMultiTool) private IconAnimation: CocosAnimationMultiTool | null = null;

    @property(Sprite) private IconSprite: Sprite | null = null;

    @property(Sprite) private TextSprite: Sprite | null = null;

    @property(Sprite) private IconSpriteLight: Sprite | null = null;

    @property(SpriteFrame) private SpriteIconFrame: SpriteFrame[] = [];

    @property(SpriteFrame) private IconSpriteLightFrame: SpriteFrame[] = [];

    @property(Sprite) private SpriteTextArray: Array<Sprite> = [];

    @property(ParticleContentTool) private Particle: ParticleContentTool | null = null;

    @property(Color) private Color: Color[] = [];

    @property(Color) private ParticleColor: Color[] = [];

    private ThisSingleJackPotType = 0;

    private CallBack: any = null;

    start() {
        this.IconSpriteLight.node.active = false;
    }

    public OnIngotShow() {
        this.IngotAnimation?.OnPlay(4);
        this.IconSpriteLight.node.active = false;
    }

    public OnIngotPlayShow() {
        this.scheduleOnce(() => this.IngotAnimation?.OnPlay(0), Math.random() * 0.2);
        this.IconSpriteLight.node.active = false;
    }

    public OnIngotPlaySelect(JackPotType: number = 0, LanguageType: number = 0, playAnim: boolean) {
        this.ThisSingleJackPotType = JackPotType;

        if (playAnim) {
            this.scheduleOnce(() => {
                this.IconSpriteLight.node.active = true;
                this.IconAnimation?.OnPlay(2);
            }, 0.3);
        } else {
            this.IconSpriteLight.node.active = true;
            this.IconAnimation?.OnPlay(1);
        }

        this.IconSpriteLight.color = this.Color[this.ThisSingleJackPotType];

        this.IconSpriteLight.spriteFrame = this.IconSpriteLightFrame[this.ThisSingleJackPotType];

        this.IconSprite.spriteFrame = this.SpriteIconFrame[this.ThisSingleJackPotType];

        for (let i = 0; i < this.SpriteTextArray.length; i++) {
            this.SpriteTextArray[i].node.active = i == JackPotType;
        }

        if (playAnim) {
            this.IngotAnimation?.OnPlay(1);
        } else {
            this.IngotAnimation?.OnPlay(2);
        }
    }

    public OnIconPlayPrepare() {
        this.IconSpriteLight.node.active = false;

        this.Particle?.SetParticleColor(this.ParticleColor[this.ThisSingleJackPotType]);

        this.IconAnimation?.OnPlay(3);
    }

    public OnIconPlayWin(cb: any | null = null) {
        this.IconSpriteLight.node.active = false;

        this.Particle?.SetParticleColor(this.ParticleColor[this.ThisSingleJackPotType]);

        this.IconAnimation?.OnPlay(4);
    }

    public OnIconPlayNoSelect() {
        this.IconSpriteLight.node.active = false;

        this.IconAnimation?.OnPlay(5);
    }

    public OnIngotPlayNoSelect() {
        this.IngotAnimation?.OnPlay(3);
    }

    public OnIconHide() {
        this.IconSpriteLight.node.active = false;

        this.IngotAnimation?.OnPlay(2);

        this.IconAnimation?.OnPlay(0);
    }
}
