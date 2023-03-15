import { _decorator, Component, Label, UIOpacity, Tween, tween } from 'cc';
const { ccclass } = _decorator;

@ccclass('QuickSpinMsg')
export class QuickSpinMsg extends Component {
    private quickSpinTxt: string = 'Quick Spin ';
    private quickSpinEnabled: string = 'Enabled';
    private quickSpinDisabled: string = 'Disabled';
    private quickSpinMsgLabel: Label;
    private uiOpacity: UIOpacity;
    private showTween: Tween<UIOpacity>;

    public init() {
        this.uiOpacity = this.getComponent(UIOpacity);
        this.quickSpinMsgLabel = this.getComponentInChildren(Label);
        this.initTween();
    }

    private initTween() {
        this.showTween = tween(this.uiOpacity)
            .to(0.5, { opacity: 255 })
            .delay(1)
            .to(
                0.5,
                { opacity: 0 },
                {
                    onComplete: (target) => {
                        (target as UIOpacity).node.active = false;
                    }
                }
            )
            .union();
    }

    public changeLocale(locale: string) {
        switch (locale) {
            case 'en':
                this.quickSpinEnabled = 'Quick Spin Enabled';
                this.quickSpinDisabled = 'Quick Spin Disabled';
                break;
            case 'zh':
                this.quickSpinEnabled = '快速旋转开启';
                this.quickSpinDisabled = '快速旋转关闭';
                break;
            case 'th':
                this.quickSpinEnabled = 'เปิดอย่างรวดเร็ว';
                this.quickSpinDisabled = 'ปิดอย่างรวดเร็ว';
                break;
        }
    }

    public showMsg(state: boolean, isShow: boolean) {
        if (!isShow) return;
        this.node.active = true;
        this.uiOpacity.opacity = 0;
        this.quickSpinMsgLabel.string = state ? this.quickSpinEnabled : this.quickSpinDisabled;

        this.showTween.stop();
        this.showTween.start();
    }
}
