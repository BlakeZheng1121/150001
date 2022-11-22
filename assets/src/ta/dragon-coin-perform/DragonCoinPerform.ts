import { _decorator, Component, Prefab } from 'cc';
import { AudioClipsEnum } from '../../game/vo/enum/SoundMap';
import { PoolManager } from '../../sgv3/PoolManager';
import { Layer } from '../../sgv3/vo/enum/Layer';
import { AudioManager } from '../tool/AudioManager';

import { CocosAnimationMultiTool } from '../tool/cocos-animation-tool/CocosAnimationMultiTool';
import { ParticleContentTool } from '../tool/particle-tool/ParticleContentTool';

const { ccclass, property } = _decorator;

@ccclass('DragonCoinPerform')
export class DragonCoinPerform extends Component {
    @property(CocosAnimationMultiTool) private DragonCoin: CocosAnimationMultiTool | null = null;

    @property({ type: Prefab, visible: true })
    public toMiniParticle: Prefab | null = null;
    @property({ type: Prefab, visible: true })
    public coinLVParticle: Prefab | null = null;
    @property({ type: Prefab, visible: true })
    public coinLVMiniParticle: Prefab | null = null;

    onLoad() {
        this.DragonCoin?.OnPlay(0);
    }

    public DragonCoinSpineInit() {
        this.DragonCoin.node.layer = Layer.PERFORM_1_PANEL;
        this.DragonCoin?.OnPlay(0);

        let particle: ParticleContentTool = PoolManager.instance
            .getNode(this.coinLVParticle, this.node)
            .getComponent(ParticleContentTool);

        particle.ParticlePlay();
        this.scheduleOnce(() => {
            PoolManager.instance.putNode(particle.node);
        }, particle.PutPoolTimes);
    }

    public DragonCoinSpineLVControl() {
        this.DragonCoin?.OnPlay(1);

        let particle: ParticleContentTool = PoolManager.instance
            .getNode(this.coinLVParticle, this.node)
            .getComponent(ParticleContentTool);

        particle.ParticlePlay();
        this.scheduleOnce(() => {
            PoolManager.instance.putNode(particle.node);
        }, particle.PutPoolTimes);
    }

    public DragonCoinSpineToMini() {
        this.DragonCoin?.OnPlay(2);

        let particle: ParticleContentTool = PoolManager.instance
            .getNode(this.coinLVMiniParticle, this.node)
            .getComponent(ParticleContentTool);

        particle.ParticlePlay();
        this.scheduleOnce(() => {
            PoolManager.instance.putNode(particle.node);
        }, particle.PutPoolTimes);
    }

    public DragonCoinFall() {
        this.DragonCoin.node.layer = Layer.PERFORM_3_PANEL;

        let particle: ParticleContentTool = PoolManager.instance
            .getNode(this.toMiniParticle, this.node)
            .getComponent(ParticleContentTool);

        particle.ParticlePlay();
        this.scheduleOnce(() => {
            PoolManager.instance.putNode(particle.node);
        }, particle.PutPoolTimes);

        this.DragonCoin?.OnPlay(3);
    }

    public DragonCoinHide() {
        this.DragonCoin?.OnPlay(4);
    }
}
