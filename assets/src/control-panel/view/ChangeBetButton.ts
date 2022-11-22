import { _decorator, Component, UIOpacity } from 'cc';
const { ccclass } = _decorator;

@ccclass('ChangeBetButton')
export class ChangeBetButton extends Component {
    public static readonly STATUS_ON: string = 'on';
    public static readonly STATUS_DISABLED: string = 'disabled';

    private uiOpacity: UIOpacity;

    public currentState = '';

    protected onLoad() {
        this.uiOpacity = this.getComponentInChildren(UIOpacity);
    }

    protected start() {
        this.changeState(ChangeBetButton.STATUS_ON);
    }

    /**
     * 改變按鈕狀態
     * @param state 狀態
     */
    public changeState(state: string) {
        this.currentState = state;
        if (state === ChangeBetButton.STATUS_DISABLED) {
            this.uiOpacity.opacity = 175;
        } else {
            this.uiOpacity.opacity = 255;
        }
    }
}
