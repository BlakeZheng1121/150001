import { _decorator, SystemEvent } from 'cc';
import { Game_QuickSpinButton } from './Game_QuickSpinButton';
import { ControlView, IControlViewMediator } from 'common-ui/view/ControlView';
const { ccclass, property } = _decorator;

@ccclass('Game_ControlView')
export class Game_ControlView extends ControlView {
    @property({ type: Game_QuickSpinButton })
    public quickSpinButton: Game_QuickSpinButton;

    public buttonCallback: Game_IControlViewMediator;

    protected registerPanelButton() {
        super.registerPanelButton();
        this.quickSpinButton.node.on(
            SystemEvent.EventType.TOUCH_END,
            this.buttonCallback.onQuickBtn,
            this.buttonCallback
        );
    }

    public updateQuickSpinState(state: string | boolean): void {
        let stateString: string = state.toString();
        this.quickSpinButton.setState(stateString);
    }
}

export interface Game_IControlViewMediator extends IControlViewMediator {
    onQuickBtn();
}
