import { _decorator, Component, Sprite } from 'cc';
import { TimeLineTool } from '../../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
const { ccclass, property } = _decorator;

@ccclass('Free_RetriggerBoard')
export class Free_RetriggerBoard extends Component {
    @property(Sprite)
    public FSpin: Sprite | null = null;

    private _retriggerBoard: TimeLineTool | null = null;

    public get retriggerBoard() {
        if (this._retriggerBoard == null) {
            this._retriggerBoard = this.node.getComponent(TimeLineTool);
        }
        return this._retriggerBoard;
    }
}
