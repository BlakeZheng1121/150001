import { _decorator, Label } from 'cc';
import { TimeLineTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
import { BaseScene } from '../../base/BaseScene';
import { UIOrientation } from '../../core/ui/UIOrientation';
import { SceneManager } from '../../core/utils/SceneManager';
import { BalanceUtil } from '../../sgv3/util/BalanceUtil';
import { GameScene } from '../../sgv3/vo/data/GameScene';
import { AudioManager } from '../../ta/tool/AudioManager';
import { AudioClipsEnum, BGMClipsEnum } from '../vo/enum/SoundMap';
const { ccclass, property } = _decorator;

@ccclass('Game_2_ResultBoardView')
export class Game_2_ResultBoardView extends BaseScene {
    @property(TimeLineTool)
    public resultBoard: TimeLineTool | null = null;

    @property(Label)
    private resultLabel: Label;

    private _uiOrientation: Array<UIOrientation> | null = null;

    private get uiOrientation() {
        if (this._uiOrientation == null) {
            this._uiOrientation = this.getComponentsInChildren(UIOrientation);
        }
        return this._uiOrientation;
    }

    public changeOrientation(orientation: string, scene: string) {
        let ishorizontal = orientation == SceneManager.EV_ORIENTATION_HORIZONTAL;
        for (let i = 0; i < this.uiOrientation.length; i++) {
            this.uiOrientation[i].changeOrientation(ishorizontal);
        }
    }

    public showWinBoard(score: number, curScene: string) {
        if (this.node.active == false) {
            this.node.active = true;
        }
        let self = this;
        self.resultLabel.string = BalanceUtil.formatBalance(score);
        self.resultBoard.play('Perform', self.winBoardEnd.bind(self));
        if (curScene == GameScene.Game_2) {
            AudioManager.Instance.stop(BGMClipsEnum.BGM_FreeGame).fade(0, 1);
            AudioManager.Instance.play(AudioClipsEnum.Result).volume(0).fade(1, 0.5);
        } else if (curScene == GameScene.Game_4) {
            AudioManager.Instance.stop(BGMClipsEnum.BGM_DragonUp).fade(0, 1);
            AudioManager.Instance.play(AudioClipsEnum.Result).volume(0).fade(1, 0.5);
        }
    }

    private winBoardEnd() {}
}
