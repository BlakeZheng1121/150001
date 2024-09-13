import { InitEventCommand } from '../../sgv3/command/InitEventCommand';

/** 覆寫 InitEventCommand方便初始化取得gamestate */
export class GAME_InitEventCommand extends InitEventCommand {
    public execute(notification: puremvc.INotification): void {
        super.execute(notification);
        // 加工 wheelData，把使用卡片的輪帶加入 wheelData
        let extraWheelData = this.gameDataProxy.initEventData.executeSetting.baseGameSetting.extraWheelData;
        if (extraWheelData) {
            for (let i = 0; i < extraWheelData.length; i++) {
                this.gameDataProxy.initEventData.executeSetting.baseGameSetting.wheelData.push(extraWheelData[i]);
            }
        }
    }
}
