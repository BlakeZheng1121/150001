
import { _decorator, } from 'cc';
import { WinBoardRunCompleteCommand } from '../../sgv3/command/winboard/WinBoardRunCompleteCommand';
import { GlobalTimer } from '../../sgv3/util/GlobalTimer';
import { GameScene } from '../../sgv3/vo/data/GameScene';
import { AudioManager } from '../../ta/tool/AudioManager';
import { GAME_GameDataProxy } from '../proxy/GAME_GameDataProxy';
import { BGMClipsEnum } from '../vo/enum/SoundMap';
const { ccclass } = _decorator;
 
@ccclass('GAME_WinBoardRunCompleteCommand')
export class GAME_WinBoardRunCompleteCommand extends WinBoardRunCompleteCommand {
    public execute(notification: puremvc.INotification): void {   
        if(this.gameDataProxy.afterGame2) {
            this.onBonusGameAfter();
            this.registerBGMchangeToIdle();
            super.execute(notification);
        }else {
            super.execute(notification);
            this.onBaseGaameAfter();
        }     
    }

    private onBaseGaameAfter() {
        if(this.gameDataProxy.curScene === GameScene.Game_1 
            && this.gameDataProxy.isTriggerBaseBGMChange
            && !this.gameDataProxy.isHitSpecial()) {
            this.registerBGMchangeToIdle();
        }  
    }

    private onBonusGameAfter() {
        AudioManager.Instance.play(BGMClipsEnum.BGM_Base).loop(true).fade(1, 3);
        AudioManager.Instance.stop(BGMClipsEnum.BGM_BaseIdle).fade(0, 3);
        this.gameDataProxy.isTriggerBaseBGMChange = true;       
    }

    private registerBGMchangeToIdle() {
        GlobalTimer.getInstance()
        .registerTimer(
            BGMClipsEnum.BGM_Base + ' _Change',
            8,
            () => {
                GlobalTimer.getInstance().removeTimer(BGMClipsEnum.BGM_Base + ' _Change');
                AudioManager.Instance.stop(BGMClipsEnum.BGM_Base).fade(0, 3);
                AudioManager.Instance.play(BGMClipsEnum.BGM_BaseIdle).loop(true).volume(0).fade(1, 3);
                this.gameDataProxy.isTriggerBaseBGMChange = false;
            },
            self
        )
        .start();
    }

    // ======================== Get Set ========================
    protected _gameDataProxy: GAME_GameDataProxy;
    protected get gameDataProxy(): GAME_GameDataProxy {
        if (!this._gameDataProxy) {
            this._gameDataProxy = this.facade.retrieveProxy(GAME_GameDataProxy.NAME) as GAME_GameDataProxy;
        }
        return this._gameDataProxy;
    }
}