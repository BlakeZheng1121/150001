import { _decorator, Component, Prefab, Vec3 } from 'cc';
import { PoolManager } from '../../../../sgv3/PoolManager';
import { TimelineTool } from 'TimelineTool';

const { ccclass, property } = _decorator;

// RD 可變動

@ccclass('FreeMysteryOnPerform')
export class FreeMysteryOnPerform extends Component {
    @property(Prefab)
    private mysterySymbol: Prefab | null = null;

    public showMystery(posInfos: Array<Vec3>){

        for (let i = 0; i < posInfos.length; i++) {
            let symbol = PoolManager.instance.getNode(this.mysterySymbol, this.node);
            symbol.setPosition(posInfos[i]);
            symbol.getComponentInChildren(TimelineTool)?.play('PlayMystery', () => 
                {PoolManager.instance.putNode(symbol);});
        }
    }
}
