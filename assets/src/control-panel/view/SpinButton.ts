import { _decorator, Component, tween, Vec3, UIOpacity, Tween, Color, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpinButton')
export class SpinButton extends Component {
    @property({ type: Sprite })
    public spinBG: Sprite;

    @property({ type: Sprite })
    public spinArrow: Sprite;

    public static readonly STATUS_ON: string = 'on';
    public static readonly STATUS_AUTO_PLAY: string = 'auto';
    public static readonly STATUS_STOP: string = 'stop';
    public static readonly STATUS_SPEED_ROTATE: string = 'speed-rotate';

    private uiOpacity: UIOpacity;
    private currentState = '';

    protected onLoad() {
        this.changeState(SpinButton.STATUS_ON);
        this.uiOpacity = this.getComponent(UIOpacity);
    }

    public changeState(state: string) {
        if (this.currentState == state) return;
        this.currentState = state;

        if (state == SpinButton.STATUS_SPEED_ROTATE) {
            this.speedUp();
        } else if (state == SpinButton.STATUS_STOP) {
            this.stopRotating();
        } else if (state == SpinButton.STATUS_ON) {
            this.startRotating();
        }
    }

    public speedUp() {
        this.ConvertNodeRotate();
        let eulerAngleZ = this.node.eulerAngles.z;

        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(0.5, { eulerAngles: new Vec3(0, 0, eulerAngleZ - 360) })
            .to(0, { eulerAngles: new Vec3(0, 0, eulerAngleZ) })
            .union()
            .repeatForever()
            .start();
    }

    public stopRotating() {
        Tween.stopAllByTarget(this.node);
    }

    public startRotating() {
        this.ConvertNodeRotate();
        let eulerAngleZ = this.node.eulerAngles.z;

        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(6, { eulerAngles: new Vec3(0, 0, eulerAngleZ - 360) })
            .to(0, { eulerAngles: new Vec3(0, 0, eulerAngleZ) })
            .union()
            .repeatForever()
            .start();
    }

    public disableBtn(disabled: boolean) {
        if (disabled) {
            this.uiOpacity.opacity = 0;
        } else {
            this.uiOpacity.opacity = 255;
        }
    }

    // 使旋轉角度小於 360 度，避免數值越來越大
    private ConvertNodeRotate() {
        let angleZ = this.node.eulerAngles.z;
        if (angleZ < -360 || angleZ > 360) {
            angleZ %= 360;
            this.node.setRotationFromEuler(0, 0, angleZ);
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
