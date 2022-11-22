import { _decorator, Component, Sprite, UIOpacity, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AutoPlayButton')
export class AutoPlayButton extends Component {
    public static readonly STATUS_ON: string = 'on';
    public static readonly STATUS_PAUSE: string = 'pause';

    @property({ type: SpriteFrame })
    public autoSprite: SpriteFrame;
    @property({ type: SpriteFrame })
    public stopSprite: SpriteFrame;

    private playIcon: Sprite;
    private uiOpacity: UIOpacity;
    private isDisabled: boolean = false;
    public get isDisabledBtn(): boolean {
        return this.isDisabled;
    }

    public currentState = '';

    protected onLoad() {
        this.playIcon = this.getComponent(Sprite);
        this.uiOpacity = this.getComponent(UIOpacity);
    }

    /**
     * 改變按鈕狀態
     * @param state 狀態
     */
    public changeState(state: string) {
        this.currentState = state;

        if (state === AutoPlayButton.STATUS_ON) {
            this.playIcon.spriteFrame = this.autoSprite;
        } else if (state === AutoPlayButton.STATUS_PAUSE) {
            this.playIcon.spriteFrame = this.stopSprite;
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
