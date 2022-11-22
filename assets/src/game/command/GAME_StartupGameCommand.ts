import { StartupGameCommand } from '../../sgv3/command/StartupGameCommand';
import { GAME_RegisterPuremvcCommand } from './GAME_RegisterPuremvcCommand';
import { GAME_RegisterStateCommand } from './GAME_RegisterStateCommand';

export class GAME_StartupGameCommand extends StartupGameCommand {
    public initializeMacroCommand(): void {
        // 註冊遊戲puremvc元件
        this.addSubCommand(GAME_RegisterPuremvcCommand);
        // 註冊遊戲狀態
        this.addSubCommand(GAME_RegisterStateCommand);

        super.initializeMacroCommand();
    }

    public execute(notification: puremvc.INotification): void {
        super.execute(notification);
    }
}
