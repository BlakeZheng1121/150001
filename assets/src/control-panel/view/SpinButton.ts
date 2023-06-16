import { _decorator, Component, UIOpacity, Color, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpinButton')
export class SpinButton extends Component {
    @property({ type: Sprite })
    public spinBG: Sprite;

    @property({ type: Sprite })
    public spinArrow: Sprite;

    @property({ type: SpriteFrame })
    public idleSpriteFrame: SpriteFrame;

    @property({ type: SpriteFrame })
    public stopSpriteFrame: SpriteFrame;

    public static readonly STATUS_ON: string = 'on';
    public static readonly STATUS_STOP: string = 'stop';

    private uiOpacity: UIOpacity;
    private currentState = '';

    private static readonly OPACITY_LOWEST_LIMIT: number = 1; /* 避免opacity為 0 時切換圖檔有機率顯示大小錯誤 */

    protected onLoad() {
        this.changeState(SpinButton.STATUS_ON);
        this.uiOpacity = this.getComponent(UIOpacity);
    }

    public changeState(state: string) {
        if (this.currentState == state) return;
        this.currentState = state;

        if (state == SpinButton.STATUS_STOP) {
            this.setSpinStop();
        } else if (state == SpinButton.STATUS_ON) {
            this.setSpinIdle();
        }
    }

    private setSpinIdle() {
        this.spinArrow.spriteFrame = this.idleSpriteFrame;
    }

    private setSpinStop() {
        this.spinArrow.spriteFrame = this.stopSpriteFrame;
    }

    public disableBtn(disabled: boolean) {
        if (disabled) {
            this.uiOpacity.opacity = SpinButton.OPACITY_LOWEST_LIMIT;
        } else {
            this.uiOpacity.opacity = 255;
        }
    }

    public isChangeDisableColor(isDisable: boolean) {
        let color: Color = SpinStateColor.getColor(isDisable);

        this.spinArrow.color = color;
        this.spinBG.color = color;
    }
}

export class SpinStateColor {
    public static ENABLE: Color = new Color(255, 255, 255);
    public static DISABLE: Color = new Color(160, 160, 160);

    public static getColor(isDisable: boolean): Color {
        return isDisable ? this.DISABLE : this.ENABLE;
    }
}
