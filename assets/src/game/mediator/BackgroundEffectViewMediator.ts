import { _decorator, Component, Node } from 'cc';
import BaseMediator from '../../base/BaseMediator';
import { GameStateProxyEvent, SceneEvent } from '../../sgv3/util/Constant';
import { GlobalTimer } from '../../sgv3/util/GlobalTimer';
import { GameScene } from '../../sgv3/vo/data/GameScene';
import { GAME_GameDataProxy } from '../proxy/GAME_GameDataProxy';
import { BackgroundEffectView } from '../view/BackgroundEffectView';
const { ccclass, property } = _decorator;

@ccclass('BackgroundEffectViewMediator')
export class BackgroundEffectViewMediator extends BaseMediator<BackgroundEffectView> {
    protected lazyEventListener(): void {}

    public listNotificationInterests(): Array<any> {
        return [GameStateProxyEvent.ON_SCENE_CHANGED];
    }

    public handleNotification(notification: puremvc.INotification): void {
        let name = notification.getName();
        switch (name) {
            case GameStateProxyEvent.ON_SCENE_CHANGED:
                this.onSceneChangeToPlayAnime();
                break;
        }
    }

    onSceneChangeToPlayAnime() {
        this.view.showBgEffect();

        const curScene = this.gameDataProxy.curScene;
        switch (curScene) {
            case GameScene.Game_1:
                this.view.playBaseGameSceneAnim();
                break;
            case GameScene.Game_2:
            case GameScene.Game_4:
                this.view.playFreeGameSceneAnime();
                break;
            case GameScene.Game_3:
                this.delayHideBgEffect();
                break;
        }
    }

    delayHideBgEffect() {
        GlobalTimer.getInstance()
            .registerTimer(
                'Game_HideBgEffect',
                5,
                () => {
                    GlobalTimer.getInstance().removeTimer('Game_HideBgEffect');
                    this.view.hideBgEffect();
                },
                this
            )
            .start();
    }

    protected _gameDataProxy: GAME_GameDataProxy;
    public get gameDataProxy(): GAME_GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GAME_GameDataProxy.NAME) as GAME_GameDataProxy;
        }
        return this._gameDataProxy;
    }
}
