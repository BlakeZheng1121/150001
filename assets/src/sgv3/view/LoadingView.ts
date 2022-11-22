import { _decorator, ProgressBar, Button, Tween, tween, Node, SystemEvent, Label } from 'cc';
import { BaseScene } from '../../base/BaseScene';
import { UrlLogoSetting } from '../../core/ui/UrlLogoSetting';
const { ccclass, property } = _decorator;

@ccclass('LoadingView')
export class LoadingView extends BaseScene {
    private curProgress: number;
    private progressDuration: number;
    private progressTween: Tween<ProgressBar>;

    @property({ type: ProgressBar })
    public progressBar: ProgressBar;

    @property({ type: Node })
    public clickToPlayBtn: Node;

    @property({ type: UrlLogoSetting })
    public logo: UrlLogoSetting;

    @property({ type: Node })
    public intro: Node;

    @property({ type: Node })
    public pending: Node;

    protected onLoad() {
        super.onLoad();
        this.clickToPlayBtn.active = false;
        this.pending.active = false;
    }

    public loadBaseResComplete(callBack: Function) {
        this.progressBar.node.active = false;
        this.clickToPlayBtn.active = true;
        this.clickToPlayBtn.once(SystemEvent.EventType.TOUCH_END, callBack);
    }

    // 隱藏所有內容
    public hideContent(): void {
        this.intro.destroy();
        this.intro = null;
        this.selfDestruct();
    }

    // 設定進度
    public setProgress(position: number): void {
        this.curProgress = position;
        if (this.curProgress < 1) {
            this.progressDuration = 0.5;
        } else {
            this.progressDuration = 0.2;
        }

        this.progressTween?.stop();
        this.progressTween = tween(this.progressBar).to(this.progressDuration, { progress: this.curProgress }).start();
    }

    // 重置載入進度
    public resetProgress() {
        this.progressBar.progress = 0;
    }

    // pending loading顯示
    public showPendingLoading() {
        this.pending.active = true;
        let loading = this.pending.getComponentInChildren(Label);
        tween(loading.color).to(0.75, { a: 150 }).to(0.75, { a: 255 }).union().repeatForever().start();
    }

    public loadingComplete() {
        this.pending.destroy();
        this.pending = null;
        this.selfDestruct();
    }

    private selfDestruct () {
        if(!this.pending && !this.intro) {
            this.node.destroy();
        }
    }
}
