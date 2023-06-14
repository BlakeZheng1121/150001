import { _decorator, Component, Node, Prefab, CCString } from 'cc';
import { TimeLineTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
import { BaseScene } from '../../base/BaseScene';
import { AudioManager } from '../../ta/tool/AudioManager';
import { AudioClipsEnum } from '../vo/enum/SoundMap';
const { ccclass, property } = _decorator;

@ccclass('PrizePredictionView')
export class PrizePredictionView extends BaseScene {
    @property(TimeLineTool) private anim: TimeLineTool | null = null;

    private sounds: AudioClipsEnum[] = [
        AudioClipsEnum.PrizePrediction01,
        AudioClipsEnum.PrizePrediction02,
        AudioClipsEnum.PrizePrediction03
    ];
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
        this.anim.play('Show', () => this.onFinish());
    }

    private playSound() {
        let index = Math.floor(Math.random() * (this.sounds.length - 0.1)); //prevent random number equal 1 will out of range
        AudioManager.Instance.play(this.sounds[index]);
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
