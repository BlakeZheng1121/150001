import { _decorator, Component, Node, size, Size, Sprite, tween, UIOpacity, UITransform } from 'cc';
import { TimelineTool } from 'TimelineTool';
import { AudioClipsEnum } from '../vo/enum/SoundMap';
import { AudioManager } from 'src/audio/AudioManager';
import { GameScene } from 'src/sgv3/vo/data/GameScene';
import BaseView from 'src/base/BaseView';
const { ccclass, property } = _decorator;

@ccclass('PrizePredictionView')
export class PrizePredictionView extends BaseView {
    @property(TimelineTool)
    private anim: TimelineTool;

    @property(UITransform)
    private mask: UITransform;

    @property(UITransform)
    private blackBackground: UITransform;

    private sounds: AudioClipsEnum[] = [AudioClipsEnum.PrizePrediction];
    private callBack: Function = null;
    onLoad() {
        this.blackBackground.node.active = false;
        super.onLoad();
    }

    play(cb: Function): void {
        const self = this;
        self.blackBackground.node.active = true;
        self.playSound();
        self.callBack = cb;
        self.anim.play('Show', () => {
            self.blackBackground.node.active = false;
            self.onFinish();
        });
    }

    private playSound() {
        let index = Math.floor(Math.random() * (this.sounds.length - 0.1)); //prevent random number equal 1 will out of range
        AudioManager.Instance.play(this.sounds[index]);
    }

    public stop() {
        this.onFinish();
    }

    public setMaskSizeState(gameScene: string) {
        let size: Size;
        switch (gameScene) {
            case GameScene.Game_2:
            case GameScene.Game_1:
            default:
                size = new Size(875, 508);
                break;

        }
        this.setMaskScale(size);
    }

    private setMaskScale(size: Size) {
        this.mask.contentSize = size;
        this.blackBackground.contentSize = size;
    }

    private onFinish() {
        const self = this;
        self.callBack?.();
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
