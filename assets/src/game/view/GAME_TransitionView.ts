import { _decorator, Component, Node, game } from 'cc';
import { TimeLineTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
import { BaseScene } from '../../base/BaseScene';
import { AudioManager } from '../../ta/tool/AudioManager';
import { CocosAnimationMultiTool } from '../../ta/tool/cocos-animation-tool/CocosAnimationMultiTool';
import { AudioClipsEnum } from '../vo/enum/SoundMap';

const { ccclass, property } = _decorator;

@ccclass('GAME_TransitionView')
export class GAME_TransitionView extends BaseScene {
    public static readonly HORIZONTAL: string = 'horizontal';
    public static readonly VERTICAL: string = 'vertical';

    public currentState = '';

    @property(TimeLineTool)
    private Transition: TimeLineTool | null = null;

    protected isTransitionBG: boolean = false; //判斷是否進行轉場.

    protected onLoad() {
        super.onLoad('TransitionViewMediator');
        game.addPersistRootNode(this.node);
    }

    /** 更改orientation mode */
    public changeOrientation(mode: string) {
        this.currentState = mode;
    }

    /** 轉場動畫*/
    public showTransition(): void {
        const self = this;
        this.setNodeActivity(true);
        this.Transition?.play('FS_Transition');
        AudioManager.Instance.play(AudioClipsEnum.FeatureSelection_DragonRoar);
    }

    public setNodeActivity(active: boolean) {
        this.node.active = active;
    }
}
