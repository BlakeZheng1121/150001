import { _decorator, Component, Node, Prefab, CCString } from 'cc';
import { BaseScene } from '../../base/BaseScene';
import { AudioManager } from '../../ta/tool/AudioManager';
import { CocosAnimationMultiTool } from '../../ta/tool/cocos-animation-tool/CocosAnimationMultiTool';
import { AudioClipsEnum } from '../vo/enum/SoundMap';
const { ccclass, property } = _decorator;

@ccclass('PrizePredictionView')
export class PrizePredictionView extends BaseScene {
    @property(CocosAnimationMultiTool)
    private anim: CocosAnimationMultiTool;

    private callBack: Function = null;
    onLoad() {
        super.onLoad();
    }

    play(cb: Function): void {
        this.callBack = cb;
        this.onFinish();
    }

    public playHorizontal(cb: Function): void {
        //
        console.error("This Game No Horizontal Type");
        //this.playSound();
        //this.callBack = cb;
        //this.anim.OnPlay(0, () => this.onFinish());
    }

    public playVertical(cb: Function): void {
        this.playSound();
        this.callBack = cb;
        this.anim.OnPlay(0, () => this.onFinish());
    }

    private playSound() {
        AudioManager.Instance.play(AudioClipsEnum.PrizePrediction);
    }

    public stop() {
        this.onFinish();
    }

    private onFinish() {
        this.callBack?.();
        this.callBack = null;
    }

    public get isPlaying(): boolean {
        return this.callBack != null;
    }

    show() {
        this.anim.node.active = true;
    }

    hide() {
        this.anim.node.active = false;
    }
}
