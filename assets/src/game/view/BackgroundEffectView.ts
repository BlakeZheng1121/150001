import { _decorator } from 'cc';
import { TimeLineTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
import { BaseScene } from '../../base/BaseScene';
const { ccclass, property } = _decorator;
 
@ccclass('BackgroundEffectView')
export class BackgroundEffectView extends BaseScene {
    @property(TimeLineTool)
    private anim: TimeLineTool;

    public showBgEffect() {
        this.node.active = true;
    }

    public hideBgEffect() {
        this.node.active = false;
    }

    public playBaseGameSceneAnim() {
        this.anim.play('base');
    }

    public playFreeGameSceneAnime() {
        this.anim.play('free');
    }
}