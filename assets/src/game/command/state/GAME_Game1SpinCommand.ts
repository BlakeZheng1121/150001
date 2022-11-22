
import { _decorator } from 'cc';
import { GlobalTimer } from '../../../sgv3/util/GlobalTimer';
import { WAY_Game1SpinCommand } from '../../../sgv3way/command/state/WAY_Game1SpinCommand';
import { AudioManager } from '../../../ta/tool/AudioManager';
import { GAME_GameDataProxy } from '../../proxy/GAME_GameDataProxy';
import { BGMClipsEnum } from '../../vo/enum/SoundMap';
const { ccclass } = _decorator;

 
@ccclass('GAME_Game1SpinCommand')
export class GAME_Game1SpinCommand extends WAY_Game1SpinCommand {
    public execute(notification: puremvc.INotification): void {
        super.execute(notification);
        if(!this.gameDataProxy.isTriggerBaseBGMChange){
            this.gameDataProxy.isTriggerBaseBGMChange = true;
            AudioManager.Instance.stop(BGMClipsEnum.BGM_BaseIdle).fade(0, 1);
            AudioManager.Instance.play(BGMClipsEnum.BGM_Base).loop(true).volume(0).fade(1, 1);
        }else{
            GlobalTimer.getInstance().removeTimer(BGMClipsEnum.BGM_Base + ' _Change');
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