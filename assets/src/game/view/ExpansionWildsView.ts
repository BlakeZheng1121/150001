import { _decorator } from 'cc';
import { AudioManager } from '../../audio/AudioManager';
import { AudioClipsEnum } from '../vo/enum/SoundMap';
import { TimeLineTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
import BaseView from 'src/base/BaseView';
const { ccclass, property } = _decorator;

@ccclass('ExpansionWildsView')
export class ExpansionWildsView extends BaseView {
    @property(TimeLineTool)
    private animL: TimeLineTool;

    @property(TimeLineTool)
    private animR: TimeLineTool;

    onLoad() {
        super.onLoad();
    }

    public show(): void {
        this.animL.node.active = this.animR.node.active = true;
        this.animL.play('L_WildExpand');
        this.animR.play('R_WildExpand');
        AudioManager.Instance.play(AudioClipsEnum.Free_Slogan);
    }

    public win(fiveOfKind: boolean, callBack?: Function): void {
        if (fiveOfKind) this.animR.play('Win');
        this.animL.play('Win');
    }

    public hide() {
        this.animL.node.active = this.animR.node.active = false;
    }
}
