import { _decorator, Vec3 } from 'cc';
import { TimelineTool } from 'TimelineTool';
import { AudioManager } from '../../audio/AudioManager';
import { AudioClipsEnum } from '../vo/enum/SoundMap';
import BaseView from 'src/base/BaseView';
const { ccclass, property } = _decorator;

@ccclass('ReelFXView')
export class ReelFXView extends BaseView {
    @property(TimelineTool)
    private anim: TimelineTool;
    
    onLoad() {
        super.onLoad();
    }

    public play(onReel4: boolean = false): void {
        this.anim.node.parent.position = new Vec3(onReel4 ? -261 : -85, this.anim.node.position.y, 0);
        this.playSound();
        this.anim.play('in');
    }

    public stop() {
        this.stopSound();
        this.anim.play('out');
    }

    private playSound() {
        AudioManager.Instance.play(AudioClipsEnum.BigWinPrediction);
    }

    private stopSound() {
        AudioManager.Instance.stop(AudioClipsEnum.BigWinPrediction);
    }

    show() {
        this.anim.node.active = true;
    }

    hide() {
        this.anim.node.active = false;
    }
}
