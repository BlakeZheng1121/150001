import { _decorator } from 'cc';
import BaseMediator from '../../base/BaseMediator';
import { ControlView } from '../../control-panel/view/ControlView';
import { SceneManager } from '../../core/utils/SceneManager';
import {
    FreeGameEvent,
    GameStateProxyEvent,
    ReelEvent,
    StateWinEvent,
    ViewMediatorEvent,
    WinEvent
} from '../../sgv3/util/Constant';
import { GameScene } from '../../sgv3/vo/data/GameScene';
import { GAME_GameDataProxy } from '../proxy/GAME_GameDataProxy';
import { Game_2_SpecialView } from '../view/free-retrigger/Game_2_SpecialView';
import { FreeGameSpecialInfo } from '../vo/FreeGameSpecialInfo';
const { ccclass } = _decorator;

@ccclass('Game_2_SpecialViewMediator')
export class Game_2_SpecialViewMediator extends BaseMediator<Game_2_SpecialView> {
    public static readonly NAME: string = 'Game_2_SpecialViewMediator';

    public constructor(name?: string, component?: any) {
        super(name, component);

        this.view.changeOrientation(
            this.gameDataProxy.orientationEvent === SceneManager.EV_ORIENTATION_HORIZONTAL
                ? ControlView.HORIZONTAL
                : ControlView.VERTICAL
        );

        this.view.init(this.gameDataProxy.language);
    }

    protected lazyEventListener(): void {}

    public listNotificationInterests(): Array<any> {
        return [
            ViewMediatorEvent.SHOW_RETRIGGER_BOARD,
            ReelEvent.ON_REELS_PERFORM_END,
            ReelEvent.ON_REELS_START_ROLL,
            SceneManager.EV_ORIENTATION_VERTICAL,
            SceneManager.EV_ORIENTATION_HORIZONTAL,
            GameStateProxyEvent.ON_SCENE_BEFORE_CHANGE,
            FreeGameEvent.ON_SIDE_BALL_SHOW,
            FreeGameEvent.ON_SIDE_BALL_SCORE_SHOW
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        let name = notification.getName();
        let self = this;
        if (self.gameDataProxy.curScene != GameScene.Game_2) return;
        switch (name) {
            case SceneManager.EV_ORIENTATION_VERTICAL:
                self.view.changeOrientation(ControlView.VERTICAL);
                break;
            case SceneManager.EV_ORIENTATION_HORIZONTAL:
                self.view.changeOrientation(ControlView.HORIZONTAL);
                break;
            case ViewMediatorEvent.SHOW_RETRIGGER_BOARD:
                self.showRetriggerBoard(notification.getBody()[0]);
                break;
            case FreeGameEvent.ON_SIDE_BALL_SHOW:
                self.onSideBallShow(notification.getBody());
                break;
            case FreeGameEvent.ON_SIDE_BALL_SCORE_SHOW:
                self.onHitSpecial(notification.getBody());
                break;
            case GameStateProxyEvent.ON_SCENE_BEFORE_CHANGE:
            case ReelEvent.ON_REELS_START_ROLL:
            case StateWinEvent.SHOW_LAST_CREDIT_BOARD:
            case StateWinEvent.ON_GAME2_OPENING:
                self.view.stopFreeWild();
                break;
        }
    }
    private onSideBallShow(freeGameSpecialInfo: FreeGameSpecialInfo) {
        this.view.showSideBall(freeGameSpecialInfo);
    }

    protected onHitSpecial(showWinEvent: Function) {
        this.view.showSideBallScore(this.onCollectCredit.bind(this), showWinEvent.bind(this));
    }

    private onCollectCredit(hitInfo: Array<any>) {
        this.facade.sendNotification(ViewMediatorEvent.COLLECT_CREDIT_BALL, hitInfo);
    }

    protected showRetriggerBoard(addRound: number) {
        this.view.retriggerShow(addRound);
    }

    private _gameDataProxy: GAME_GameDataProxy;
    private get gameDataProxy(): GAME_GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GAME_GameDataProxy.NAME) as GAME_GameDataProxy;
        }
        return this._gameDataProxy;
    }
}
