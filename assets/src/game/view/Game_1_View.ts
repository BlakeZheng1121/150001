import { _decorator } from 'cc';
import { TimeLineTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
import { BaseScene } from '../../base/BaseScene';
import { UIOrientation } from '../../core/ui/UIOrientation';
import { SceneManager } from '../../core/utils/SceneManager';
import { GameUIOrientationSetting } from '../vo/GameUIOrientationSetting';
// import { GAME_ShowView } from './GAME_ShowView';
// import { GAME_EffectView } from './GAME_EffectView';
// import { GAME_FortuneBallView } from './GAME_FortuneBallView';

const { ccclass, property } = _decorator;

@ccclass('Game_1_View')
export class Game_1_View extends BaseScene {
    public static readonly HORIZONTAL: string = 'horizontal';
    public static readonly VERTICAL: string = 'vertical';

    private _uiOrientation: Array<UIOrientation> | null = null;

    @property({ type: TimeLineTool })
    private bg_effect: TimeLineTool = null;

    private get uiOrientation() {
        if (this._uiOrientation == null) {
            this._uiOrientation = this.getComponentsInChildren(UIOrientation);
        }
        return this._uiOrientation;
    }

    private _gameUIOrientation: Array<GameUIOrientationSetting> | null = null;

    private get gameUIOrientation() {
        if (this._gameUIOrientation == null) {
            this._gameUIOrientation = this.getComponentsInChildren(GameUIOrientationSetting);
        }
        return this._gameUIOrientation;
    }

    // public showView: GAME_ShowView;
    // public effectView: GAME_EffectView;
    // public fortuneballView: GAME_FortuneBallView;

    protected onLoad() {
        super.onLoad();
        // TODO: 讓場景資料可用initData設定
        // this.fortuneballView.mySceneName =
        //     this.effectView.mySceneName =
        //     this.showView.mySceneName =
    }

    public changeOrientation(orientation: string, scene: string) {
        let ishorizontal = orientation == SceneManager.EV_ORIENTATION_HORIZONTAL;
        for (let i = 0; i < this.uiOrientation.length; i++) {
            this.uiOrientation[i].changeOrientation(ishorizontal);
        }

        for (let i = 0; i < this.gameUIOrientation.length; i++) {
            this.gameUIOrientation[i].changeOrientation(ishorizontal, scene);
        }
    }

    protected onEnable () {
        this.bg_effect.play("base");
    }
    protected onDisable () {
        this.bg_effect.stop();
    }
}
