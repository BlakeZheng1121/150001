import { _decorator, Component, SpriteFrame, Sprite, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SettingMenuButton')
export class SettingMenuButton extends Component {
    public static readonly STATUS_DISABLED: string = 'disabled';
    public static readonly STATUS_UP: string = 'up';

    @property({ type: SpriteFrame })
    public enableSprite: SpriteFrame;
    @property({ type: SpriteFrame })
    public disableSprite: SpriteFrame;

    private iconImg: Sprite;
    private _uiOpacity: UIOpacity;
    private get uiOpacity(): UIOpacity {
        if (!this._uiOpacity) {
            this._uiOpacity = this.getComponent(UIOpacity);
        }
        return this._uiOpacity;
    }

    public currentState = '';

    protected onLoad() {
        this.iconImg = this.getComponent(Sprite);
    }

    /**
     * 改變按鈕狀態
     * @param hasSound 是否開啟音效
     */
    public changeState(status: string) {
        if (status === SettingMenuButton.STATUS_DISABLED) {
            this.currentState = SettingMenuButton.STATUS_DISABLED;
            if (this.disableSprite) this.iconImg.spriteFrame = this.disableSprite;
            else if (this.uiOpacity) {
                this.uiOpacity.opacity = 175;
            }
        } else {
            this.currentState = SettingMenuButton.STATUS_UP;
            if (this.enableSprite) this.iconImg.spriteFrame = this.enableSprite;
            else if (this.uiOpacity) this.uiOpacity.opacity = 255;
        }
    }
}
