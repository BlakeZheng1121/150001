
import { Font, Label, Prefab, _decorator } from 'cc';
import { ParticleContentTool } from '../../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
import { SymbolContentBase } from '../../../sgv3/view/reel/symbol/SymbolContentBase';
import { PoolManager } from '../../../sgv3/PoolManager';
const { ccclass, property } = _decorator;

 
@ccclass('Game_1_SymbolContent')
export class Game_1_SymbolContent extends SymbolContentBase {
    @property({ type: Label, visible: true })
    public labelText: Label | null = null;
    @property({ type: Font, visible: true })
    public baseFont: Font | null = null;
    @property({ type: Font, visible: true })
    public specialFont: Font | null = null;
    @property({ type: Prefab, visible: true })
    public particlePrefab: Prefab | null = null;

    public credit: number = 0;

    public isSpecialFont: boolean = false;


    private particleContent: ParticleContentTool;
    private recycleParticleCallback: Function;

    public createParticlePrefab() {
        const self = this;
        self.particleContent = PoolManager.instance
            .getNode(self.particlePrefab, self.node)
            .getComponent(ParticleContentTool);

        self.particleContent.ParticlePlay();
        self.recycleParticleCallback = self.recycleParticlePrefab;
        self.scheduleOnce(self.recycleParticleCallback, 0.8);
    }

    public recycleParticlePrefab() {
        const self = this;
        if (self.particleContent) {
            self.particleContent.ParticleClear();
            self.particleContent.ParticleStop();
            PoolManager.instance.putNode(self.particleContent.node);
            self.particleContent = null;
        }
    }

    public forceRecycleParticlePrefab() {
        this.unschedule(this.recycleParticleCallback);
        this.recycleParticlePrefab();
    }
}
