import { _decorator } from 'cc';
import { Game_ControlView, Game_IControlViewMediator } from '../view/Game_ControlView';
import { SpeedMode } from '../vo/enum/Game_UIEnums';
import { ScreenEvent, SoundEvent } from 'src/sgv3/util/Constant';
import { setEngineTimeScale } from 'src/core/utils/SceneManager';
import { ControlViewMediator } from 'common-ui/mediator/ControlViewMediator';

const { ccclass } = _decorator;

@ccclass('Game_ControlViewMediator')
export class Game_ControlViewMediator extends ControlViewMediator implements Game_IControlViewMediator {
    private Game_view: Game_ControlView;

    constructor(name?: string, component?: any) {
        super(name, component);
        this.Game_view = this.view as Game_ControlView;
    }

    public listNotificationInterests(): string[] {
        return Array.from(new Set([ScreenEvent.ON_SPIN_DOWN].concat(super.listNotificationInterests())));
    }

    public handleNotification(notification: puremvc.INotification): void {
        let name = notification.getName();
        switch (name) {
            case ScreenEvent.ON_SPIN_DOWN:
                this.Game_view.quickSpinButton.closeNewIcon();
                break;
            default:
                super.handleNotification(notification);
                break;
        }
    }

    protected setQuickSpinStatus(isQuickSpin: boolean) {
        let state: string = isQuickSpin ? this.gameDataProxy.curSpeedMode : SpeedMode.STATUS_NORMAL;
        this.Game_view.updateQuickSpinState(state);
        this.view.quickSpinMsg.showMsg(isQuickSpin, this.isShowQuickSpinMsg);
        this.isShowQuickSpinMsg = false;
    }

    protected setQuickSpinFromWeb(isQuickSpin: boolean) {
        if (this.UIProxy.isQuickSpin != isQuickSpin) {
            this.onQuickBtn(isQuickSpin);
        }
    }

    public onQuickBtn(isQuickSpin: boolean | null = null): void {
        if (this.view.quickSpinButton.interactable) {
            if (this.gameDataProxy.curSpeedMode == SpeedMode.STATUS_TURBO || isQuickSpin === false) {
                // 切換成一般模式
                this.gameDataProxy.curSpeedMode = SpeedMode.STATUS_NORMAL;
                this.isShowQuickSpinMsg = true;
                this.UIProxy.isQuickSpin = this.isQuickSpin = false;
                setEngineTimeScale(1);
            } else if (this.gameDataProxy.curSpeedMode == SpeedMode.STATUS_QUICK) {
                //一段加速 切換成 二段加速
                this.gameDataProxy.curSpeedMode = SpeedMode.STATUS_TURBO;
                this.setQuickSpinStatus(true);
                setEngineTimeScale(3);
            } else if (this.gameDataProxy.curSpeedMode == SpeedMode.STATUS_NORMAL || isQuickSpin === true) {
                //一般模式 切換成 一段加速
                this.gameDataProxy.curSpeedMode = SpeedMode.STATUS_QUICK;
                this.isShowQuickSpinMsg = true;
                this.UIProxy.isQuickSpin = this.isQuickSpin = true;
                setEngineTimeScale(1);
            }

            this.quickSpin(); //按鈕被點擊後統一要做的動作
        }
    }

    public quickSpin() {
        if (this.view.quickSpinButton.interactable) {
            this.hideAllMenu();
            this.sendNotification(SoundEvent.BUTTON_DOWN_SOUND);
            this.webBridgeProxy.getWebFunRequest(this, 'updateTurboMode', this.isQuickSpin);
        }
    }
}
