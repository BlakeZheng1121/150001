import { _decorator, Sprite, UIOpacity, Color, SpriteFrame } from 'cc';
import { UIButton } from 'common-ui/view/UIButton';
import { SpeedMode } from '../vo/enum/Game_UIEnums';
import { ButtonState } from 'common-ui/proxy/UIEnums';

import { TimeLineTool } from 'TimeLineTool';
import { QuickSpinButton } from 'common-ui/view/QuickSpinButton';
const { ccclass, property } = _decorator;

@ccclass('Game_QuickSpinButton')
export class Game_QuickSpinButton extends QuickSpinButton {
    @property({ type: SpriteFrame })
    public turboOnSprite: SpriteFrame;
    @property({ type: Color })
    public turboOnColor: Color;

    @property({ type: TimeLineTool })
    public newIcon: TimeLineTool = null;

    protected onLoad() {
        super.onLoad();
        this.newIcon.play('sweep');
    }

    public setState(state: string) {

        this.state = state;
        switch (state) {
            case SpeedMode.STATUS_QUICK:
                this.iconImg.spriteFrame = this.quickOnSprite;
                this.iconImg.color = this.quickOnColor;
                break;
            case SpeedMode.STATUS_NORMAL:
                this.iconImg.spriteFrame = this.quickOffSprite;
                this.iconImg.color = this.quickOffColor;
                break;
            case SpeedMode.STATUS_TURBO:
                this.iconImg.spriteFrame = this.turboOnSprite;
                this.iconImg.color = this.turboOnColor;
                break;
            default:
                super.setState(state);
                break;
        }
    }
    public closeNewIcon() {
        this.newIcon.node.active = false;
    }
}
