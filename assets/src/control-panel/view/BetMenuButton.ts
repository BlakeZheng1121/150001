import { BalanceUtil } from '../../sgv3/util/BalanceUtil';
import { _decorator, Component, SpriteFrame, Sprite, Label, Color } from 'cc';
const { ccclass } = _decorator;

@ccclass('BetMenuButton')
export class BetMenuButton extends Component {
    public static readonly STATUS_ACTIVE: string = 'active';
    public static readonly STATUS_DOWN: string = 'down';

    private normalSprite: SpriteFrame;
    private selectedSprite: SpriteFrame;

    private _iconImg: Sprite;
    private get iconImg(): Sprite {
        if (this._iconImg == null) {
            this._iconImg = this.getComponent(Sprite);
        }
        return this._iconImg;
    }
    private _label: Label;
    private get label(): Label {
        if (this._label == null) {
            this._label = this.getComponentInChildren(Label);
        }
        return this._label;
    }

    private normalLabelColor: Color = new Color('#808080');

    public totalBetNum: string;
    public btnVal: number;

    public currentState = '';

    public setTotalBet(totalBet: number) {
        this.btnVal = totalBet;
        this.totalBetNum = BalanceUtil.formatBalance(totalBet);
        this.label.string = this.totalBetNum;
    }

    public setStateSprite(normal: SpriteFrame, selected: SpriteFrame) {
        this.normalSprite = normal;
        this.selectedSprite = selected;
    }

    /**
     * 改變按鈕狀態
     * @param state 狀態
     */
    public changeState(state: string) {
        this.currentState = state;
        if (state == BetMenuButton.STATUS_ACTIVE) {
            this.iconImg.spriteFrame = this.selectedSprite;
            this.label.color = Color.WHITE;
        } else {
            this.iconImg.spriteFrame = this.normalSprite;
            this.label.color = this.normalLabelColor;
        }
    }
}
