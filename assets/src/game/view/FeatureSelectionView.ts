import { _decorator, SystemEvent, Tween, UIOpacity, tween, Label, Animation } from 'cc';
import { ParticleContentTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/particle-tool/ParticleContentTool';
import { BaseScene } from '../../base/BaseScene';
import { UILayout } from '../../core/ui/UILayout';
import { UIOrientation } from '../../core/ui/UIOrientation';
import { SceneManager } from '../../core/utils/SceneManager';
import { BalanceUtil } from '../../sgv3/util/BalanceUtil';
import { GlobalTimer } from '../../sgv3/util/GlobalTimer';
import { FeatureSelectButton } from '../../sgv3/view/feature-selection/FeatureSelectButton';
import { GameOperation } from '../../sgv3/vo/enum/GameOperation';
import { AudioManager } from '../../ta/tool/AudioManager';
import { AudioClipsEnum, BGMClipsEnum } from '../vo/enum/SoundMap';
const { ccclass, property } = _decorator;

@ccclass('FeatureSelectionView')
export class FeatureSelectionView extends BaseScene {
    public static readonly HORIZONTAL: string = 'horizontal';
    public static readonly VERTICAL: string = 'vertical';
    private showTween: Tween<UIOpacity>;
    private _isShowComplete: boolean;

    public callBack: Function | null = null;
    public uiOpacity: UIOpacity;

    @property({ type: FeatureSelectButton })
    public featureButtons: Array<FeatureSelectButton> = [];

    private occupiedButtons: Array<FeatureSelectButton> = [];

    @property({ type: [ParticleContentTool] })
    public buttonFX: Array<ParticleContentTool> = [];

    @property({ type: Animation })
    public AnimBlackBG: Animation | null = null;

    @property({ type: Label })
    public ballCount: Label;

    @property({ type: Label })
    public ballTotalCredit: Label;

    @property({ type: Label, visible: true })
    public autoStart: Label | null = null;

    @property({ type: Number, visible: true  })
    public autoStartTime: number = 0;

    public autoStartCallBack: Function | null = null;

    public autoStartKey: string = String('AutoStart');

    public autoStartTimeKey: string = String('AutoStartTime');

    private _scrollUILayout: UILayout | null = null;
    private get scrollUILayout() {
        if (this._scrollUILayout == null) {
            this._scrollUILayout = this.getComponentInChildren(UILayout);
        }
        return this._scrollUILayout;
    }

    private _uiOrientation: Array<UIOrientation> | null = null;

    private get uiOrientation() {
        if (this._uiOrientation == null) {
            this._uiOrientation = this.getComponentsInChildren(UIOrientation);
        }
        return this._uiOrientation;
    }

    public initView() {
        const self = this;

        self.isShowComplete = false;
        self.uiOpacity = self.getComponent(UIOpacity);
        // self.hideFeatureSelection();
        self.registerButton();
        self.hide();
        self.autoStartCallBack = () => {
            self.callBack(GameOperation[GameOperation.freeGame_01]);
        }
    }

    public initTween(duration: number) {
        this.showTween = tween(this.uiOpacity).to(
            duration,
            { opacity: 255 },
            {
                onComplete: (target) => {
                    this.isShowComplete = true;
                    this.registerAutoStart();
                }
            }
        );
    }

    private registerButton() {
        const self = this;

        self.featureButtons.forEach((featureBtn) => {
            featureBtn.node.on(
                SystemEvent.EventType.TOUCH_END,
                () => self.callBack(featureBtn.operation),
                self.callBack
            );
        });
    }

    /** 更改orientation mode */
    public changeOrientation(orientation: string) {
        let ishorizontal = orientation == SceneManager.EV_ORIENTATION_HORIZONTAL;
        this.scrollUILayout.changeOrientation(ishorizontal);
        for (let i = 0; i < this.uiOrientation.length; i++) {
            this.uiOrientation[i].changeOrientation(ishorizontal);
        }
    }

    public showFeatureSelection(data: any) {
        let ballCount: number = data[0];
        let ballTotalCredit: number = data[1];
        this.ballCount.string = ballCount.toString();
        this.ballTotalCredit.string = BalanceUtil.formatBalance(ballTotalCredit);

        this.occupiedButtons = this.featureButtons.filter(this.getFilter(ballCount == 15));
        this.uiOpacity.opacity = 0;
        this.node.active = true;
        this.occupiedButtons.forEach((featureBtn) => featureBtn.showButton());
        let FeatureSelection_Crowd_Volume = 1;
        let FeatureSelection_Crowd_FadeTime = 2;
        AudioManager.Instance.play(AudioClipsEnum.FeatureSelection_Crowd)
            .volume(0)
            .loop(true)
            .fade(FeatureSelection_Crowd_Volume, FeatureSelection_Crowd_FadeTime);
        this.showTween.start();
    }

    private getFilter(onlyFreeGame: boolean) {
        return onlyFreeGame
            ? (freeBtn: FeatureSelectButton) =>
                  GameOperation[freeBtn.operation] >= GameOperation.freeGame_01 &&
                  GameOperation[freeBtn.operation] <= GameOperation.freeGame_10
            : (freeBtn: FeatureSelectButton) =>
                  GameOperation[freeBtn.operation] == GameOperation.topUpGame_01 ||
                  (GameOperation[freeBtn.operation] >= GameOperation.freeGame_01 &&
                      GameOperation[freeBtn.operation] <= GameOperation.freeGame_10);
    }

    public hideFeatureSelection() {
        if (!this.node.active) {
            return;
        }
        this.occupiedButtons.forEach((featureBtn, index, arr) =>
            featureBtn.hideButton(index == arr.length - 1 ? this.hide.bind(this) : null)
        );
        this.AnimBlackBG.play('BlackBG_Hide');

        // this.uiOpacity.opacity = 0;
        // this.node.active = false;
    }

    hide() {
        this.stopButtonParticle();
        this.uiOpacity.opacity = 0;
        this.node.active = false;
        this.resetAutoStart();
    }

    public onFeatureSelect(operation: string) {
        const self = this;
        self.isShowComplete = false;
        self.occupiedButtons.forEach((freeBtn) => freeBtn.selectOperation(operation));
        self.AnimBlackBG.play('BlackBG_PlayShow');
        self.setButtonParticlePos(operation);
        self.showButtonParticle();
        let FeatureSelection_Crowd_Volume = 0;
        let FeatureSelection_Crowd_FadeTime = 2;
        AudioManager.Instance.stop(AudioClipsEnum.FeatureSelection_Crowd).fade(
            FeatureSelection_Crowd_Volume,
            FeatureSelection_Crowd_FadeTime
        );
        AudioManager.Instance.play(AudioClipsEnum.FeatureSelection_BestChoice);
        switch (operation) {
            case 'freeGame_01':
                AudioManager.Instance.play(BGMClipsEnum.BGM_FreeGame).loop(true).volume(0).fade(1, 1);
                //AudioManager.Instance.fade(BGMClipsEnum.BGM_FreeGame, 1, 0.7);
                break;
            case 'topUpGame_01':
                AudioManager.Instance.play(BGMClipsEnum.BGM_DragonUp).loop(true).volume(0).fade(1, 1);
                //AudioManager.Instance.fade(BGMClipsEnum.BGM_DragonUp, 1, 0.7);
                break;
        }
        this.stopAutoStartTimer();
        
    }

    public setButtonParticlePos(operation: string) {
        const self = this;

        const featureBtn = self.featureButtons.find((element) => element.operation == operation);
        featureBtn?.node.insertChild(this.buttonFX[0].node, 0);
        featureBtn?.node.insertChild(this.buttonFX[1].node, 0);
    }

    public showButtonParticle() {
        for (let i in this.buttonFX) {
            this.buttonFX[i].node.active = true;
            this.buttonFX[i].ParticlePlay();
        }
    }

    public stopButtonParticle() {
        for (let i in this.buttonFX) {
            this.buttonFX[i].ParticleClear();
            this.buttonFX[i].node.active = false;
        }
    }

    public get isShowComplete(): boolean {
        return this._isShowComplete;
    }

    private set isShowComplete(isComplete: boolean) {
        this._isShowComplete = isComplete;
    }

    private registerAutoStart() {
        let self = this;
        GlobalTimer.getInstance()
            .registerTimer(
                this.autoStartTimeKey,
                1,
                () => {
                    self.autoStart.string = String(parseInt(self.autoStart.string) - 1);
                },
                this,
                self.autoStartTime
            )
            .start();
        GlobalTimer.getInstance()
            .registerTimer(this.autoStartKey, self.autoStartTime + 1, () => self.autoStartCallBack(), this)
            .start();
    }

    public resetAutoStart() {
        this.autoStart.string = this.autoStartTime.toString();
        this.stopAutoStartTimer();
    }

    private stopAutoStartTimer() {
        GlobalTimer.getInstance().removeTimer(this.autoStartKey);
        GlobalTimer.getInstance().removeTimer(this.autoStartTimeKey);
    }

}
