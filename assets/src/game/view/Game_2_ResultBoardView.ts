import { _decorator, Label } from 'cc';
import { TimeLineTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
import { BalanceUtil } from '../../sgv3/util/BalanceUtil';
import { GameScene } from '../../sgv3/vo/data/GameScene';
import { AudioManager } from '../../audio/AudioManager';
import { AudioClipsEnum, BGMClipsEnum } from '../vo/enum/SoundMap';
import BaseView from 'src/base/BaseView';
const { ccclass, property } = _decorator;

@ccclass('Game_2_ResultBoardView')
export class Game_2_ResultBoardView extends BaseView {
    @property(TimeLineTool)
    public resultBoard: TimeLineTool | null = null;

    @property(Label)
    private resultLabel: Label;

    public showWinBoard(score: number, curScene: string) {
        if (this.node.active == false) {
            this.node.active = true;
        }
        let self = this;
        self.resultLabel.string = BalanceUtil.formatBalance(score);
        self.resultBoard.play('Perform', self.winBoardEnd.bind(self));
        if (curScene == GameScene.Game_2) {
            AudioManager.Instance.stop(BGMClipsEnum.BGM_FreeGame).fade(0, 0.2);
            AudioManager.Instance.play(AudioClipsEnum.Free_Result);
        } else if (curScene == GameScene.Game_4) {
            AudioManager.Instance.stop(BGMClipsEnum.BGM_DragonUp).fade(0, 0.2);
            AudioManager.Instance.play(AudioClipsEnum.DragonUp_Result);
        }
    }

    private winBoardEnd() {}
}
