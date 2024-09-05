import { _decorator, Component, Sprite } from 'cc';
import { TimelineTool } from 'TimelineTool';
const { ccclass, property } = _decorator;

@ccclass('Free_RetriggerBoard')
export class Free_RetriggerBoard extends Component {
    @property(Sprite)
    public FSpin: Sprite | null = null;

    private _retriggerBoard: TimelineTool | null = null;

    public get retriggerBoard() {
        if (this._retriggerBoard == null) {
            this._retriggerBoard = this.node.getComponent(TimelineTool);
        }
        return this._retriggerBoard;
    }
}
