import { _decorator, ProgressBar, Node, Tween, tween, SystemEvent, Label, Sprite, Camera } from 'cc';
import { UrlLogoSetting } from '../../core/ui/UrlLogoSetting';
import BaseView from 'src/base/BaseView';
const { ccclass, property } = _decorator;

@ccclass('LoadingView')
export class LoadingView extends BaseView {
    public static readonly HORIZONTAL: string = 'horizontal';
    public static readonly VERTICAL: string = 'vertical';

    @property({ type: ProgressBar })
    public progressBar: ProgressBar;

    @property({ type: Node })
    public clickToPlayBtn: Node;

    @property({ type: UrlLogoSetting })
    public logo: UrlLogoSetting;
    
    @property({ type: UrlLogoSetting })
    public provider: UrlLogoSetting;

    @property({ type: Node })
    public intro: Node;

    @property({ type: Node })
    public pending: Node;

    @property({ type: Sprite })
    public introBG: Sprite;

    @property({ type: Camera })
    public mainCamera: Camera;

    public curProgress: number = 0;
    private targetProgress: number = 0;
    private progressDuration: number;
    private progressTween: Tween<LoadingView>;
    private isIntroBGLoadComplete = false;

    protected onLoad() {
        super.onLoad();
        this.clickToPlayBtn.active = false;
        this.pending.active = false;
        this.mainCamera.enabled = false;
    }

    protected update() {
        if (this.isAllIntroBackgroundsLoaded() && this.isIntroBGLoadComplete == false) {
            // TODO 通知 Container 關閉品牌載入頁面，並顯示遊戲畫面
            this.notifyParentLoadingComplete();
            this.initProgressBar();
            this.isIntroBGLoadComplete = true;
        }
    }

    /**更改orientation mode */
    public changeOrientation(mode: string, scene: string) {
        let ishorizontal = mode == LoadingView.HORIZONTAL;
    }

    public loadBaseResComplete(callBack: Function) {
        this.progressBar.node.active = false;
        this.clickToPlayBtn.active = true;
        this.clickToPlayBtn.once(SystemEvent.EventType.TOUCH_END, callBack);
    }

    // 隱藏所有內容
    public hideContent(): void {
        this.mainCamera.enabled = true;
        this.intro.destroy();
        this.intro = null;
        this.selfDestruct();
    }

    // 設定進度
    public setProgress(position: number): void {
        this.targetProgress = position * 0.1 + 0.8;
        if (this.targetProgress < 1) {
            this.progressDuration = 1.0;
        } else {
            this.progressDuration = 0.2;
        }
        if (this.introBG.spriteFrame) {
            this.progressTween?.stop();
            this.progressTween = tween(<LoadingView>this)
                .to(
                    this.progressDuration,
                    { curProgress: this.targetProgress },
                    {
                        onUpdate: (target: LoadingView) => this.onUpdateProgress(target)
                    }
                )
                .start();
        }
    }

    private onUpdateProgress(target: LoadingView) {
        this.progressBar.progress = target.curProgress;
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

    private selfDestruct() {
        if (!this.pending && !this.intro) {
            this.node.destroy();
        }
    }

    private initProgressBar() {
        this.setProgress(this.targetProgress);
    }

    private isAllIntroBackgroundsLoaded(): boolean {
        // 判斷是否所有 intro 圖片都已載入
        return (
            this.introBG.spriteFrame !== null &&
            this.introBG
                .getComponentsInChildren(Sprite)
                .every(sprite => sprite.spriteFrame !== null)
        );
    }

    private notifyParentLoadingComplete() {
        // 通知 Container 關閉Loading頁面
        let url_string = window.location.href;
        let url = new URL(url_string);
        var cUrl = url.searchParams.get('curl');
        window.parent.postMessage(
            JSON.stringify({
                name: 'setLoading',
                data: false
            }),
            cUrl
        );
    }
}
