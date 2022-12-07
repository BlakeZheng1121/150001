
import { Font, Label, Prefab, _decorator } from 'cc';
import { ParticleContentTool } from '../../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
import { SymbolContentBase } from '../../../sgv3/view/reel/symbol/SymbolContentBase';
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

    public dampingParticle: ParticleContentTool | null = null;
}
