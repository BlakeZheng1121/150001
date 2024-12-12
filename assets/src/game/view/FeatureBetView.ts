import { _decorator, Color, Sprite } from 'cc';
import { AudioManager } from 'src/audio/AudioManager';
import BaseView from 'src/base/BaseView';
import { TimelineTool } from 'TimelineTool';
const { ccclass, property } = _decorator;

@ccclass('FeatureBetView')
export class FeatureBetView extends BaseView {
    @property({ type: Sprite })
    public symbolList: Sprite[] = [];
    @property({ type: TimelineTool })
    public symbolFXlList: TimelineTool[] = [];

    private preFeatureIdx: number = 0;
    private soundList: string[] = [];
    private fxActiveList: boolean[] = [];
    private symbolActiveList: boolean[][] = [
        [true, true, true, true, true, true],
        [false, true, true, true, true, true],
        [false, false, true, true, true, true],
        [false, false, false, false, true, true],
        [false, false, false, false, false, false]
    ];

    public setSoundList(soundList: string[]) {
        this.soundList = soundList;
    }

    public onClickFeatureBet(featureIdx: number) {
        this.playFeatureBetSound(featureIdx);
        this.setSymbol(featureIdx);
    }

    private playFeatureBetSound(featureIdx: number) {
        if (this.preFeatureIdx < featureIdx) {
            AudioManager.Instance.stop(this.soundList[featureIdx]);
            AudioManager.Instance.play(this.soundList[featureIdx]);
        }
        this.preFeatureIdx = featureIdx;
    }

    public restoreFeatureBet(featureIdx: number) {
        this.setSymbol(featureIdx);
    }

    private setSymbol(featureIdx: number) {
        for (let i = 0; i < this.symbolList.length; i++) {
            const active = this.symbolActiveList[featureIdx][i];
            this.setSymbolActive(i, active);
            // this.setSymbolFXActive(i, active);
        }
    }

    private setSymbolActive(index: number, active: boolean) {
        this.symbolList[index].color = active ? Color.WHITE : Color.GRAY;
    }

    private setSymbolFXActive(index: number, active: boolean) {
        if (this.fxActiveList[index] != active) {
            this.fxActiveList[index] = active;
            if (active) {
                this.symbolFXlList[index].play('Start');
            } else {
                this.symbolFXlList[index].play('Empty');
            }
        }
    }

    public hideAllMenu() {}
}
