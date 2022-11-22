import { _decorator, Component, Label } from 'cc';
import { GlobalTimer } from '../../sgv3/util/GlobalTimer';
import { CocosAnimationMultiTool } from '../../ta/tool/cocos-animation-tool/CocosAnimationMultiTool';
const { ccclass, property } = _decorator;

@ccclass('RemainSpinInfo')
export class RemainSpinInfo extends Component {
    @property({ type: Label })
    private curRemainSpinTimes: Label;
    // 加場次特效
    @property({ type: CocosAnimationMultiTool })
    private remainSpinFX: CocosAnimationMultiTool;

    private curSpinTime: number = 0;

    public setCurSpinTime(curSpinTime: number) {
        this.curSpinTime = curSpinTime;
        if (this.curSpinTime > 0) {
            this.curRemainSpinTimes.string = String(this.curSpinTime);
            this.node.active = true;
        } else {
            this.node.active = false;
        }
    }

    public updateReSpinInfo(reSpinTime: number) {
        this.curSpinTime = this.curSpinTime + reSpinTime;
        this.node.active = this.curSpinTime > 0;
        this.remainSpinFX.OnPlay(0);
        GlobalTimer.getInstance().removeTimer('DelayChangeSpinTime');
        GlobalTimer.getInstance()
            .registerTimer(
                'DelayChangeSpinTime',
                0.5,
                () => {
                    this.curRemainSpinTimes.string = String(this.curSpinTime);
                },
                this
            )
            .start();
    }
}
