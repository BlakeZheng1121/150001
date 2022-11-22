import { _decorator, Component, Enum } from 'cc';
import { CocosAnimationMultiTool } from '../../../ta/tool/cocos-animation-tool/CocosAnimationMultiTool';
import { GameOperation } from '../../vo/enum/GameOperation';
const { ccclass, property } = _decorator;

@ccclass('FeatureSelectButton')
export class FeatureSelectButton extends Component {
    @property({ type: Enum(GameOperation) })
    private gameOperation: GameOperation;

    private _animationTool: CocosAnimationMultiTool;

    public get operation(): string {
        return GameOperation[this.gameOperation];
    }

    public hideButton(callBack?: Function) {
        this.animationTool?.OnPlay(0, callBack);
    }

    public showButton() {
        this.animationTool?.OnPlay(1);
    }

    public selectOperation(operation: string) {
        if (operation == GameOperation[this.gameOperation]) {
            // 選擇動畫
            this.animationTool.OnPlay(2);
        } else {
            // 未選擇動畫
            this.animationTool.OnPlay(3);
        }
    }

    private get animationTool() {
        if (!this._animationTool) {
            this._animationTool = this.getComponent(CocosAnimationMultiTool);
        }
        return this._animationTool;
    }
}
