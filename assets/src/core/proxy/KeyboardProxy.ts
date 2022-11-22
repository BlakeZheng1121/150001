import { EventKeyboard, SystemEvent, systemEvent } from 'cc';

export class KeyboardProxy extends puremvc.Proxy {
    public static readonly NAME: string = 'KeyboardProxy';
    public static readonly EV_KEY_DOWN: string = 'EV_KEY_DOWN';
    public constructor() {
        super(KeyboardProxy.NAME);
        this.registerEvent();
    }
    // global keyboard event
    private registerEvent() {
        const self = this;
        systemEvent.on(
            SystemEvent.EventType.KEY_DOWN,
            function (event: EventKeyboard) {
                self.facade.sendNotification(KeyboardProxy.EV_KEY_DOWN, event);
            },
            self
        );
    }
}
