import { _decorator, Component, Label, UIOpacity, Tween, tween } from 'cc';
import * as i18n from '../../../../extensions/i18n/assets/LanguageData';
const { ccclass } = _decorator;

@ccclass('QuickSpinMsg')
export class QuickSpinMsg extends Component {
    private quickSpinEnabled: string = 'quickSpinEnabled';
    private quickSpinDisabled: string = 'quickSpinDisabled';
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

    public showMsg(state: boolean, isShow: boolean) {
        if (!isShow) return;
        this.node.active = true;
        this.uiOpacity.opacity = 0;
        this.quickSpinMsgLabel.string = i18n.t(state ? this.quickSpinEnabled : this.quickSpinDisabled);

        this.showTween.stop();
        this.showTween.start();
    }
}
