
import { _decorator, Component} from 'cc';

import { CocosAnimationMultiTool } from '../tool/cocos-animation-tool/CocosAnimationMultiTool';

const { ccclass, property } = _decorator;

@ccclass('FreeC1')
export class FreeC1 extends Component {

    @property(CocosAnimationMultiTool)private FreeC1Symbol: CocosAnimationMultiTool|null = null;
    @property(CocosAnimationMultiTool)private FreeC1Trail: CocosAnimationMultiTool|null = null;

    onLoad () {
           
    }

    public OnFreeC1Show(){
        this.FreeC1Symbol?.OnPlay(0);            
    }    

    public OnFreeC1TrailPerform(){
        this.FreeC1Symbol?.OnPlay(1,()=>this.OnFreeC1TrailHit());          
    }  

    private OnFreeC1TrailHit(){
        this.FreeC1Trail?.OnPlay(1);          
    }  

}
