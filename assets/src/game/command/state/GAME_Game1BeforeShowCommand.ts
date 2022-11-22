
import { _decorator, } from 'cc';
import { Game1BeforeShowCommand } from '../../../sgv3/command/state/Game1BeforeShowCommand';
import { StateMachineProxy } from '../../../sgv3/proxy/StateMachineProxy';
import { GlobalTimer } from '../../../sgv3/util/GlobalTimer';
import { BaseGameResult } from '../../../sgv3/vo/result/BaseGameResult';
import { AudioManager } from '../../../ta/tool/AudioManager';
import { GAME_GameDataProxy } from '../../proxy/GAME_GameDataProxy';
import { BGMClipsEnum } from '../../vo/enum/SoundMap';
const { ccclass } = _decorator;
 
@ccclass('GAME_Game1BeforeShowCommand')
export class GAME_Game1BeforeShowCommand extends Game1BeforeShowCommand {
    public execute(notification: puremvc.INotification): void {
        super.execute(notification);
        let baseGameResult: BaseGameResult = this.gameDataProxy.curRoundResult as BaseGameResult;

        if (baseGameResult.baseGameTotalWin == 0 
            && !this.gameDataProxy.isHitSpecial()
            && this.gameDataProxy.isTriggerBaseBGMChange) {
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