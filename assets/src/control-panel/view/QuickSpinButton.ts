import { _decorator, Component, Sprite, UIOpacity, Color, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('QuickSpinButton')
export class QuickSpinButton extends Component {
    public static readonly STATUS_ON: string = 'on';
    public static readonly STATUS_OFF: string = 'off';
    public static readonly STATUS_DISABLED: string = 'disabled';

    @property({ type: SpriteFrame })
    public enableSprite: SpriteFrame;
    @property({ type: Color })
    public enableColor: Color;
    @property({ type: SpriteFrame })
    public disableSprite: SpriteFrame;
    @property({ type: Color })
    public disableColor: Color;

    private isDisabled: boolean = false;
    public get isDisabledBtn(): boolean {
        return this.isDisabled;
    }

    private iconImg: Sprite;
    private uiOpacity: UIOpacity;

    public currentState = '';

    protected onLoad() {
        this.iconImg = this.getComponent(Sprite);
        this.uiOpacity = this.getComponent(UIOpacity);
    }

    protected start() {
        this.changeState(QuickSpinButton.STATUS_OFF);
    }

    /**
     * 改變按鈕狀態
     * @param state 狀態
     */
    public changeState(state: string) {
        this.currentState = state;

        if (state === QuickSpinButton.STATUS_OFF) {
            this.iconImg.spriteFrame = this.disableSprite;
            this.iconImg.color = this.disableColor;
        } else if (state === QuickSpinButton.STATUS_ON) {
            this.iconImg.spriteFrame = this.enableSprite;
            this.iconImg.color = this.enableColor;
        }
    }

    public disabledBtn(disabled: boolean) {
        if (disabled) {
            this.uiOpacity.opacity = 175;
        } else {
            this.uiOpacity.opacity = 255;
        }
        this.isDisabled = disabled;
    }
}
