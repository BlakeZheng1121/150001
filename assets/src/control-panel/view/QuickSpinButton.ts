import { _decorator, Component, Sprite, UIOpacity, Color, SpriteFrame } from 'cc';
import { SpeedMode } from '../../game/vo/enum/Game_UIEnums';
import { TimeLineTool } from '../../../../extensions/timelinetool/assets/src/ta/tool/timeline-tool/TimeLineTool';
const { ccclass, property } = _decorator;

@ccclass('QuickSpinButton')
export class QuickSpinButton extends Component {
    @property({ type: SpriteFrame })
    public NormalOnSprite: SpriteFrame;
    @property({ type: Color })
    public NormalOnColor: Color;
    @property({ type: SpriteFrame })
    public QuickOnSprite: SpriteFrame;
    @property({ type: Color })
    public QuickOnColor: Color;
    @property({ type: SpriteFrame })
    public turboOnSprite: SpriteFrame;
    @property({ type: Color })
    public turboOnColor: Color;

    @property({ type: TimeLineTool })
    public newIcon: TimeLineTool = null;

    private isDisabled: boolean = false;
    public get isDisabledBtn(): boolean {
        return this.isDisabled;
    }

    private iconImg: Sprite;
    private uiOpacity: UIOpacity;

    public currentState = '';

    protected onLoad() {
        this.iconImg = this.getComponent(Sprite);
        this.uiOpacity = this.getComponent(UIOpacity);
    }

    protected start() {
        this.changeState(SpeedMode.STATUS_NORMAL);
        this.newIcon.play('sweep');
    }

    /**
     * 改變按鈕狀態
     * @param state 狀態
     */
    public changeState(state: string) {
        this.currentState = state;

        switch (state) {
            case SpeedMode.STATUS_QUICK:
                this.iconImg.spriteFrame = this.QuickOnSprite;
                this.iconImg.color = this.QuickOnColor;
                break;
            case SpeedMode.STATUS_NORMAL:
                this.iconImg.spriteFrame = this.NormalOnSprite;
                this.iconImg.color = this.NormalOnColor;
                break;
            case SpeedMode.STATUS_TURBO:
                this.iconImg.spriteFrame = this.turboOnSprite;
                this.iconImg.color = this.turboOnColor;
                break;
        }
    }

    public disabledBtn(disabled: boolean) {
        if (disabled) {
            this.uiOpacity.opacity = 175;
        } else {
            this.uiOpacity.opacity = 255;
        }
        this.isDisabled = disabled;
    }
    public closeNewIcon() {
        this.newIcon.node.active = false;
    }
}
