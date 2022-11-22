import { _decorator, Component, Node, Label } from 'cc';
import { ComboBox } from './ComboBox';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {
    cb: ComboBox = null;
    index: number = 0;
    onLoad() {}

    initComboBox(cb: ComboBox) {
        this.cb = cb;
    }

    itemBtn(event) {
        // 子项点击后改变下拉按钮上的文本
        this.cb.comboLabel.string = event.target.children[0].getComponent(Label).string;
        this.cb.changeTimelineIndex(this.index);
        // 选择后改变小三角和下拉框显示
        this.cb.comboboxClicked();
    }
}
