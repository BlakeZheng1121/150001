import { _decorator, Component, Color, Sprite, SpriteFrame } from 'cc';

import { CocosAnimationMultiTool } from '../tool/cocos-animation-tool/CocosAnimationMultiTool';
import { ParticleContentTool } from '../tool/particle-tool/ParticleContentTool';

const { ccclass, property } = _decorator;

@ccclass('MiniResultBoard')
export class MiniResultBoard extends Component {
    @property(CocosAnimationMultiTool) private BoardAnimation: CocosAnimationMultiTool | null = null;

    @property(Sprite) private BoardSprite: Sprite[] = [];

    @property(Sprite) private IconSprite: Sprite | null = null;

    @property(Sprite) private SpriteLight: Sprite | null = null;

    @property([Sprite]) private SpriteTextArray: Array<Sprite> = [];

    @property(SpriteFrame) private SpriteBoardFrame: SpriteFrame[] = [];

    @property(SpriteFrame) private SpriteIconFrame: SpriteFrame[] = [];

    @property(ParticleContentTool) private Particle: ParticleContentTool | null = null;

    @property(Color) private Color: Color[] = [];

    //播放板子(彩金狀態0~4為mini到grand,語系:0為中文1為英文)
    public OnBoardPlay(JackPotType: number = 0, LanguageType: number = 0) {
        this.Particle?.SetParticleColor(this.Color[JackPotType]);

        for (let i = 0; i < this.BoardSprite.length; i++) {
            this.BoardSprite[i].spriteFrame = this.SpriteBoardFrame[JackPotType];
        }

        for (let i = 0; i < this.SpriteTextArray.length; i++) {
            this.SpriteTextArray[i].node.active = (i == JackPotType);
        }

        this.IconSprite.spriteFrame = this.SpriteIconFrame[JackPotType];

        this.SpriteLight.color = this.Color[JackPotType];

        this.BoardAnimation?.OnPlay(0);
    }

    public OnBoardClose() {
        this.BoardAnimation?.OnPlay(1);
    }
}
