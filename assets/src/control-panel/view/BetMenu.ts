import { _decorator, Component, UITransform, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BetMenu')
export class BetMenu extends Component {
    @property({ type: Label })
    public title: Label;

    @property({ type: UITransform })
    public content: UITransform;

    private _betMenu: UITransform | null = null;

    private _titleTransform: UITransform | null = null;

    public get transform() {
        if (this._betMenu == null) {
            this._betMenu = this.node.getComponent(UITransform);
        }
        return this._betMenu;
    }

    public get titleTransform() {
        if (this._titleTransform == null) {
            this._titleTransform = this.title.node.parent.getComponent(UITransform);
        }
        return this._titleTransform;
    }
}
