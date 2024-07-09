import { _decorator, Component, Enum } from 'cc';
import { TimeLineTool } from '../../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
import { GameOperation } from '../../vo/enum/GameOperation';
const { ccclass, property } = _decorator;

@ccclass('FeatureSelectButton')
export class FeatureSelectButton extends Component {
    @property({ type: Enum(GameOperation) })
    private gameOperation: GameOperation;

    private _timeLineTool: TimeLineTool;

    public get operation(): string {
        return GameOperation[this.gameOperation];
    }

    public hideButton(callBack?: Function) {
        this.timeLineTool?.play('Hide', callBack);
    }

    public showButton() {
        this.timeLineTool?.play('PlayShow');
    }

    public selectOperation(operation: string) {
        if (operation == GameOperation[this.gameOperation]) {
            // 選擇動畫
            this.timeLineTool?.play('PlaySelect');
        } else {
            // 未選擇動畫
            this.timeLineTool?.play('NoSelect');
        }
    }

    private get timeLineTool() {
        if (!this._timeLineTool) {
            this._timeLineTool = this.getComponent(TimeLineTool);
        }
        return this._timeLineTool;
    }
}
