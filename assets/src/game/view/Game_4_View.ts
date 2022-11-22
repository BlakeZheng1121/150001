import { _decorator } from 'cc';
import { BaseScene } from '../../base/BaseScene';
import { UIOrientation } from '../../core/ui/UIOrientation';
import { SceneManager } from '../../core/utils/SceneManager';
import { GameUIOrientationSetting } from '../vo/GameUIOrientationSetting';
import { PosTweenView } from './dragon-up/PosTweenView';
const { ccclass } = _decorator;

@ccclass('Game_4_View')
export class Game_4_View extends BaseScene {
    public static readonly HORIZONTAL: string = 'horizontal';
    public static readonly VERTICAL: string = 'vertical';

    private _uiOrientation: Array<UIOrientation> | null = null;

    private get uiOrientation() {
        if (this._uiOrientation == null) {
            this._uiOrientation = this.getComponentsInChildren(UIOrientation);
        }
        return this._uiOrientation;
    }

    private _posTweenView: PosTweenView | null = null;

    public get posTweenView() {
        if (this._posTweenView == null) {
            this._posTweenView = this.getComponentInChildren(PosTweenView);
        }
        return this._posTweenView;
    }

    private _gameUIOrientation: Array<GameUIOrientationSetting> | null = null;

    private get gameUIOrientation() {
        if (this._gameUIOrientation == null) {
            this._gameUIOrientation = this.getComponentsInChildren(GameUIOrientationSetting);
        }
        return this._gameUIOrientation;
    }

    protected onLoad() {
        super.onLoad();
    }

    public init(accMultiple: number) {
        this.posTweenView.init(accMultiple);
    }

    public changeOrientation(orientation: string, scene: string) {
        let ishorizontal = orientation == SceneManager.EV_ORIENTATION_HORIZONTAL;
        for (let i = 0; i < this.uiOrientation.length; i++) {
            this.uiOrientation[i].changeOrientation(ishorizontal);
        }

        for (let i = 0; i < this.gameUIOrientation.length; i++) {
            this.gameUIOrientation[i].changeOrientation(ishorizontal, scene);
        }
        this.posTweenView.changeOrientation(ishorizontal);
    }
}
