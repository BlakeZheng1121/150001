import { _decorator, Component, Sprite } from 'cc';
import { CocosAnimationMultiTool } from '../../../ta/tool/cocos-animation-tool/CocosAnimationMultiTool';
const { ccclass, property } = _decorator;

@ccclass('Free_RetriggerBoard')
export class Free_RetriggerBoard extends Component {
    @property(Sprite)
    public FSpin: Sprite | null = null;

    private _retriggerBoard: CocosAnimationMultiTool | null = null;

    public get retriggerBoard() {
        if (this._retriggerBoard == null) {
            this._retriggerBoard = this.node.getComponent(CocosAnimationMultiTool);
        }
        return this._retriggerBoard;
    }
}
