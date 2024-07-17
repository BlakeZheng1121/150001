import { director, instantiate, Label, Prefab, _decorator } from 'cc';
import { SceneManager } from '../../core/utils/SceneManager';
import { GameUIOrientationSetting } from '../vo/GameUIOrientationSetting';
import BaseView from 'src/base/BaseView';
const { ccclass, property } = _decorator;

@ccclass('Game_2_View')
export class Game_2_View extends BaseView {
    @property({ type: [Prefab], visible: true })
    private loadPrefab: Array<Prefab> | null = [];

    // @property({ type: Label, visible: true })
    // private awardLabel: Label;

    public static readonly HORIZONTAL: string = 'horizontal';
    public static readonly VERTICAL: string = 'vertical';

    private _gameUIOrientation: Array<GameUIOrientationSetting> | null = null;

    private get gameUIOrientation() {
        if (this._gameUIOrientation == null) {
            this._gameUIOrientation = this.getComponentsInChildren(GameUIOrientationSetting);
        }
        return this._gameUIOrientation;
    }

    protected onLoad() {
        super.onLoad();
        for (let i = 0; i < this.loadPrefab.length; i++) {
            let loadPrefab = instantiate(this.loadPrefab[i]);
            director.getScene().addChild(loadPrefab);
        }
    }

    /** 更新 award 場次 */
    public setAwardMessage(curGameOperation: string) {
        // this.awardLabel.string = this.getAwardMessage(curGameOperation);
    }

    public changeOrientation(orientation: string, scene: string) {
        let ishorizontal = orientation == SceneManager.EV_ORIENTATION_HORIZONTAL;
        for (let i = 0; i < this.gameUIOrientation.length; i++) {
            this.gameUIOrientation[i].changeOrientation(ishorizontal, scene);
        }
    }

    // public getAwardMessage(curGameOperation: string) {
    //     let award = {
    //         freeGame_01: '3',
    //         freeGame_02: '2',
    //         freeGame_03: '1'
    //     };
    //     return award[curGameOperation];
    // }
}
