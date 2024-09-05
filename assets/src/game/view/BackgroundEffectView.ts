import { _decorator } from 'cc';
import { TimelineTool } from 'TimelineTool';
import BaseView from 'src/base/BaseView';
const { ccclass, property } = _decorator;
 
@ccclass('BackgroundEffectView')
export class BackgroundEffectView extends BaseView {
    @property(TimelineTool)
    private anim: TimelineTool;

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