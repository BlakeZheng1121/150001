
import { _decorator } from 'cc';
import BaseView from 'src/base/BaseView';
import { ParticleContentTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
const { ccclass, property } = _decorator;

@ccclass('WinSumFXView')
export class WinSumFXView extends BaseView {
    @property({ type: ParticleContentTool })
    public winSumAnim: ParticleContentTool;
}