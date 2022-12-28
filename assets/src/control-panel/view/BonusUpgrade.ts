import { _decorator, Component, Node, Sprite, Label } from 'cc';
import { BalanceUtil } from '../../sgv3/util/BalanceUtil';
const { ccclass, property } = _decorator;

@ccclass('BonusUpgrade')
export class BonusUpgrade extends Component {
    @property({ type: Node })
    public bonusUpgradeHint: Node;
    @property({ type: Node })
    public bonusUpgradeMessage: Node;

    @property({ type: [Sprite] })
    public betInRangeSprite: Sprite[] = [];
    @property({ type: [Label] })
    public betInRangeLabel: Label[] = [];

    public onBetLevelChange(levelIndex: number) {
        this.clearCurrentBetInRange();
        this.betInRangeSprite[levelIndex].enabled = true;
    }

    public setBonusUpgradeInfo(minBets: number[], maxBets: number[]) {
        for (let i = 0; i < this.betInRangeLabel.length; i++) {
            this.betInRangeLabel[i].string =
                'Bet ' + BalanceUtil.formatBalance(minBets[i]) + ' to ' + BalanceUtil.formatBalance(maxBets[i]);
        }
    }

    private clearCurrentBetInRange() {
        for (let i = 0; i < this.betInRangeSprite.length; i++) {
            this.betInRangeSprite[i].enabled = false;
        }
    }
}
