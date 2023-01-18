import { _decorator, Component } from 'cc';
import BaseMediator from '../../base/BaseMediator';
import { SceneManager } from '../../core/utils/SceneManager';
import { ReelDataProxy } from '../../sgv3/proxy/ReelDataProxy';
import { ReelEvent, SceneEvent } from '../../sgv3/util/Constant';
import { ReelFXView } from '../view/ReelFXView';
const { ccclass, property } = _decorator;

@ccclass('ReelFXViewMediator')
export class ReelFXViewMediator extends BaseMediator<ReelFXView> {
    protected lazyEventListener(): void {}

    public listNotificationInterests(): Array<any> {
        return [
            ReelEvent.ON_SINGLE_REEL_START_DAMPING,
            SceneEvent.LOAD_BASE_COMPLETE,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        let name = notification.getName();
        switch (name) {
            case ReelEvent.ON_SINGLE_REEL_START_DAMPING:
                this.onSingleReelStartDamping(notification.getBody());
                break;
            case SceneEvent.LOAD_BASE_COMPLETE:
                this.view.node.active = true;
                break;
        }
    }
    onSingleReelStartDamping(id: number): void {
        if (this.reelDataProxy.isSlowMotionAry[3]) {
            switch (id) {
                case 2:
                    this.view.play(true);
                    break;
                case 3:
                    this.view.stop();
                    break;
            }
        }
        if (this.reelDataProxy.isSlowMotionAry[4]) {
            switch (id) {
                case 3:
                    this.view.play();
                    break;
                case 4:
                    this.view.stop();
                    break;
            }
        }
    }

    protected _reelDataProxy: ReelDataProxy;
    protected get reelDataProxy(): ReelDataProxy {
        if (!this._reelDataProxy) {
            this._reelDataProxy = this.facade.retrieveProxy(ReelDataProxy.NAME) as ReelDataProxy;
        }
        return this._reelDataProxy;
    }
}
