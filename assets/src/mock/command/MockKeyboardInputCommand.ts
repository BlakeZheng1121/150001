import { Component, EventKeyboard, KeyCode } from 'cc';
import { KeyboardProxy } from '../../core/proxy/KeyboardProxy';
import { SlotViewMediator } from '../../mocktool/mediator/SlotViewMediator';
import { ScreenEvent } from '../../sgv3/util/Constant';

export class MockKeyboardInputCommand extends puremvc.SimpleCommand {
    public static readonly NAME: string = KeyboardProxy.EV_KEY_DOWN;

    public execute(notification: puremvc.INotification): void {
        if (this.checkKeyCode(notification.getBody()) && !this.checkMockViewVisible()) {
            this.sendNotification(ScreenEvent.ON_SPIN_DOWN);
        }
        super.execute(notification);
    }

    private checkKeyCode(event: EventKeyboard): boolean {
        return event instanceof EventKeyboard && this.checkCorrectKeycode(event.keyCode);
    }
    private checkCorrectKeycode(keyCode: number): boolean {
        return keyCode == KeyCode.SPACE || keyCode == KeyCode.ENTER;
    }

    private checkMediatorExist(): boolean {
        return !!SlotViewMediator;
    }

    private checkMediatorNameExist(): boolean {
        return this.checkMediatorExist() && !!SlotViewMediator.NAME;
    }

    private checkMockViewVisible(): boolean {
        if (this.checkMediatorNameExist()) {
            var viewComponent: Component = this.facade.retrieveMediator(SlotViewMediator.NAME).getViewComponent();
            if (!!viewComponent && viewComponent.node.active) {
                return true;
            }
        }
        return false;
    }
}
