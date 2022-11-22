import { _decorator } from 'cc';
import BaseMediator from '../../base/BaseMediator';
import { SceneManager } from '../../core/utils/SceneManager';
import { StateWinEvent } from '../../sgv3/util/Constant';
import { GameScene } from '../../sgv3/vo/data/GameScene';
import { AudioManager } from '../../ta/tool/AudioManager';
import { GAME_GameDataProxy } from '../proxy/GAME_GameDataProxy';
import { Game_2_ResultBoardView } from '../view/Game_2_ResultBoardView';
import { BGMClipsEnum } from '../vo/enum/SoundMap';

const { ccclass } = _decorator;

@ccclass('Game_2_ResultBoardViewMediator')
export class Game_2_ResultBoardViewMediator extends BaseMediator<Game_2_ResultBoardView> {
    public static readonly NAME: string = 'Game_2_ResultBoardViewMediator';

    public constructor(name?: string, component?: any) {
        super(name, component);
    }

    protected lazyEventListener(): void {}

    public listNotificationInterests(): Array<any> {
        return [
            StateWinEvent.SHOW_LAST_CREDIT_BOARD,
            SceneManager.EV_ORIENTATION_VERTICAL,
            SceneManager.EV_ORIENTATION_HORIZONTAL
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        let name = notification.getName();
        let self = this;
        if (self.gameDataProxy.curScene == GameScene.Game_3) return;
        switch (name) {
            case SceneManager.EV_ORIENTATION_HORIZONTAL:
                self.onOrientationHorizontal();
                break;
            case SceneManager.EV_ORIENTATION_VERTICAL:
                self.onOrientationVertical();
                break;
            case StateWinEvent.SHOW_LAST_CREDIT_BOARD:
                // AudioManager.Instance.stopBGM();
                self.showWinBoard(notification.getBody());
                break;
        }
    }

    /** 執行橫式轉換 */
    protected onOrientationHorizontal(): void {
        let curScene = this.gameDataProxy.curScene;
        this.view?.changeOrientation(SceneManager.EV_ORIENTATION_HORIZONTAL, curScene);
    }

    /** 執行直式轉換 */
    protected onOrientationVertical(): void {
        let curScene = this.gameDataProxy.curScene;
        this.view?.changeOrientation(SceneManager.EV_ORIENTATION_VERTICAL, curScene);
    }

    private showWinBoard(score: number) {
        let self = this;
        let curScene = self.gameDataProxy.curScene;
        self.view.showWinBoard(score, curScene);
    }

    private _gameDataProxy: GAME_GameDataProxy;
    private get gameDataProxy(): GAME_GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GAME_GameDataProxy.NAME) as GAME_GameDataProxy;
        }
        return this._gameDataProxy;
    }
}
