import { _decorator, Label, Node, Sprite, UIOpacity } from 'cc';
import BaseView from 'src/base/BaseView';
import { StringUtil } from 'src/core/utils/StringUtil';
import { BalanceUtil } from 'src/sgv3/util/BalanceUtil';
const { ccclass, property } = _decorator;

@ccclass('BonusUpgradeView')
export class BonusUpgradeView extends BaseView {
    @property({ type: Node })
    public bonusUpgradeHint: Node;
    @property({ type: Node })
    public bonusUpgradeMessage: Node;

    @property({ type: [Sprite] })
    public betInRangeSprite: Sprite[] = [];
    @property({ type: [Label] })
    public betInRangeLabel: Label[] = [];

    public nodeOpacity: UIOpacity[] = [];

    public onBetLevelChange(levelIndex: number) {
        this.clearCurrentBetInRange();
        this.betInRangeSprite[levelIndex].enabled = true;
        this.getNodeOpacity(levelIndex).opacity = 255;
    }

    public setBonusUpgradeInfo(minBets: number[], maxBets: number[]) {
        for (let i = 0; i < this.betInRangeLabel.length; i++) {
            this.betInRangeLabel[i].string = StringUtil.format(
                this.betInRangeLabel[i].string,
                BalanceUtil.formatBalance(minBets[i]),
                BalanceUtil.formatBalance(maxBets[i])
            );
            this.betInRangeLabel[i].updateRenderData(true);
        }
    }

    private clearCurrentBetInRange() {
        for (let i = 0; i < this.betInRangeSprite.length; i++) {
            this.betInRangeSprite[i].enabled = false;
            this.getNodeOpacity(i).opacity = 125;
        }
    }

    private getNodeOpacity(index: number) {
        if (this.nodeOpacity[index] == null) {
            this.nodeOpacity[index] = this.betInRangeSprite[index].node.getComponent(UIOpacity);
        }
        return this.nodeOpacity[index];
    }
}
