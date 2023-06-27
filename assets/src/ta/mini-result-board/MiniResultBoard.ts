import { _decorator, Component, Color, Sprite, SpriteFrame, Prefab, Vec3 } from 'cc';
import { PoolManager } from '../../sgv3/PoolManager';
import { ParticleContentTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
import { TimeLineTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';

const { ccclass, property } = _decorator;

@ccclass('ParticleEffect')
export class ParticleEffect {
    @property(ParticleContentTool)
    public Particle: ParticleContentTool | null = null;
    @property(Color)
    public Color: Color[] = [];
}

@ccclass('MiniResultBoard')
export class MiniResultBoard extends Component {
    @property(TimeLineTool) private BoardAnimation: TimeLineTool | null = null;

    @property(Sprite) private BoardSprite: Sprite[] = [];

    @property(Sprite) private TextSprite: Sprite | null = null;

    @property(Sprite) private SpriteLight: Sprite | null = null;

    @property(SpriteFrame) private SpriteBoardFrame: SpriteFrame[] = [];

    @property(Sprite) private SpriteTextArray: Array<Sprite> = [];

    @property(Color) private SpriteLightColor: Color[] = [];

    @property({ type: ParticleEffect})
    public ParticleEffects: ParticleEffect[] = [];

    @property({ type: Prefab })
    public particlePrefab: Prefab | null = null;
    private winCoinFall: ParticleContentTool;

    //播放板子(彩金狀態0~4為mini到grand,語系:0為中文1為英文)
    public OnBoardPlay(JackPotType: number = 0, LanguageType: number = 0) {
        this.SetEffectType(JackPotType, LanguageType);
        this.BoardAnimation?.play('Show');
    }

    public OnBoardDelayPlay(callBack?: Function) {
        this.BoardAnimation?.play('DelayShow', () => callBack());
    }

    public OnBoardClose() {
        this.BoardAnimation?.play('Hide');
    }

    //設定JackPotType對應的美術資源(彩金狀態0~4為mini到grand,語系:0為中文1為英文)
    public SetEffectType(JackPotType: number = 0, LanguageType: number = 0) {
        this.setParitcleEffects(JackPotType);

        for (let i = 0; i < this.BoardSprite.length; i++) {
            this.BoardSprite[i].spriteFrame = this.SpriteBoardFrame[JackPotType];
        }

        for (let i = 0; i < this.SpriteTextArray.length; i++) {
            this.SpriteTextArray[i].node.active = i == JackPotType;
        }

        this.SpriteLight.color = this.SpriteLightColor[JackPotType];
    }

    public playWinCoinFall() {
        this.winCoinFall = PoolManager.instance
            .getNode(this.particlePrefab, this.BoardAnimation.node)
            .getComponent(ParticleContentTool);
        this.winCoinFall.node.position = new Vec3(0, 540, 0);
        this.winCoinFall.node.setSiblingIndex(1);
        this.winCoinFall.ParticlePlay(true, 0.5);
    }

    public stopWinCoinFall() {
        this.winCoinFall.ParticleStop();
        this.scheduleOnce(() => {
            PoolManager.instance.putNode(this.winCoinFall.node);
        }, this.winCoinFall.PutPoolTimes);
    }

    setParitcleEffects(JackPotType: number = 0) {
        this.ParticleEffects?.forEach((value)=>{
            value.Particle?.SetParticleColor(value.Color[JackPotType]);
        });
    }
}
