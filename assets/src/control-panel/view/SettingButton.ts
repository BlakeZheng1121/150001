import { Component, UIOpacity, _decorator } from 'cc';

const { ccclass } = _decorator;

@ccclass('SettingButton')
export class SettingButton extends Component {
    public static readonly STATUS_ON: string = 'on';
    public static readonly STATUS_DISABLED: string = 'disabled';

    public uiOpacity: UIOpacity;

    public currentState = '';

    protected onLoad() {
        this.uiOpacity = this.getComponent(UIOpacity);
    }

    /**
     * 改變按鈕狀態
     * @param state 狀態
     */
    public changeState(state: string) {
        this.currentState = state;

        if (state === SettingButton.STATUS_DISABLED) {
            this.uiOpacity.opacity = 175;
        } else {
            this.uiOpacity.opacity = 255;
        }
    }
}
