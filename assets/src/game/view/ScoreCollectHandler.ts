
import { _decorator, Component, Label, Font, Node } from 'cc';
import { CocosAnimationMultiTool } from '../../ta/tool/cocos-animation-tool/CocosAnimationMultiTool';
import { ParticleContentTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
const { ccclass, property } = _decorator;
 
@ccclass('ScoreCollectHandler')
export class ScoreCollectHandler extends Component {
    @property(Label) private countLabel: Label | null = null;

    @property(Label) private scoreLabel: Label | null = null;

    @property(Node) private countGroup: Node | null = null;

    @property([ParticleContentTool]) private particles: ParticleContentTool[] = [];
    
    @property(CocosAnimationMultiTool) private scoreCollectAnimation: CocosAnimationMultiTool | null = null;

    public ballCountUpdate(info: string) {
        if(!this.countGroup.active){
            this.countGroup.active = true;
            this.scoreLabel.node.active = false;
        }
        this.countLabel.string = info;
    }

    public ballCountHide() {
        if(this.countGroup.active){
            this.countGroup.active = false;
            this.scoreLabel.node.active = false;
        }
        this.countLabel.string = String();
    }

    public onScoreCollect(score: string, PlayType: number) {
        if(!this.scoreLabel.node.active){
            this.countGroup.active = false;
            this.scoreLabel.node.active = true;
        }
        this.scoreLabel.string = score;
        this.scoreCollectAnimation.OnPlay(PlayType);
    }

    //** 結算分數加總 表演*/
    public onScoreSum(playType: number | null = 6) {
        this.scoreCollectAnimation.OnPlay(playType);
    }

    public allFXClear() {
        for(let i in this.particles){
            this.particles[i].ParticleClear();     
        }
    }
}
