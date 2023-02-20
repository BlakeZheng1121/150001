import { _decorator, Label, tween } from 'cc';
import { BaseScene } from '../../base/BaseScene';
import { SceneManager } from '../../core/utils/SceneManager';
import { AudioManager } from '../../ta/tool/AudioManager';
import { CocosAnimationMultiTool } from '../../ta/tool/cocos-animation-tool/CocosAnimationMultiTool';
import { AudioClipsEnum } from '../vo/enum/SoundMap';
const { ccclass, property } = _decorator;

@ccclass('ExpansionWildsView')
export class ExpansionWildsView extends BaseScene {
    @property(CocosAnimationMultiTool)
    private animL: CocosAnimationMultiTool;

    @property(CocosAnimationMultiTool)
    private animR: CocosAnimationMultiTool;

    onLoad() {
        super.onLoad();
    }

    public show(): void {
        this.animL.node.active = this.animR.node.active = true;
        this.animL.OnPlay(0);
        this.animR.OnPlay(1);
        AudioManager.Instance.play(AudioClipsEnum.Free_ExpandWild);
        setTimeout(() => {
            SceneManager.instance.shakeScreen();
        }, 600);
    }

    public win(fiveOfKind: boolean, language: string, callBack?: Function): void {
        let lang = language == 'en' ? 3 : 2;
        if (fiveOfKind) this.animR.OnPlay(lang);
        this.animL.OnPlay(lang);
    }

    public hide() {
        this.animL.node.active = this.animR.node.active = false;
    }
}
