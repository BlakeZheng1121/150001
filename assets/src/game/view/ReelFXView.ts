import { _decorator, Vec3 } from 'cc';
import { BaseScene } from '../../base/BaseScene';
import { UIOrientation } from '../../core/ui/UIOrientation';
import { AudioManager } from '../../ta/tool/AudioManager';
import { CocosAnimationMultiTool } from '../../ta/tool/cocos-animation-tool/CocosAnimationMultiTool';
import { AudioClipsEnum } from '../vo/enum/SoundMap';
const { ccclass, property } = _decorator;

@ccclass('ReelFXView')
export class ReelFXView extends BaseScene {
    @property(CocosAnimationMultiTool)
    private anim: CocosAnimationMultiTool;

    private uiOrientation: UIOrientation;

    // @property()
    //private sound: string = 'BigWinPrediction';
    onLoad() {
        super.onLoad();
        this.uiOrientation = this.node.getComponent(UIOrientation);
    }

    public play(onReel4: boolean = false): void {
        this.anim.node.parent.position = new Vec3(onReel4 ? -261 : -85, this.anim.node.position.y, 0);
        this.playSound();
        this.anim.OnPlay(0);
    }

    public stop() {
        this.stopSound();
        this.anim.OnPlay(1);
    }

    private playSound() {
        AudioManager.Instance.play(AudioClipsEnum.BigWinPrediction);
    }

    private stopSound() {
        AudioManager.Instance.stop(AudioClipsEnum.BigWinPrediction);
    }

    public changeOrientation(isHorizontal: boolean) {
        this.uiOrientation.changeOrientation(isHorizontal);
    }

    show() {
        this.anim.node.active = true;
    }

    hide() {
        this.anim.node.active = false;
    }
}
