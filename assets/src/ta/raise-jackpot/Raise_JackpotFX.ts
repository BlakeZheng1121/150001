import { _decorator, Component, sp } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Raise_JackpotFX')
export class Raise_JackpotFX extends Component {
    private _raise_jackpotFX: Array<sp.Skeleton> = null;

    private get raise_jackpotFX() {
        if (this._raise_jackpotFX == null) {
            this._raise_jackpotFX = this.node.getComponentsInChildren(sp.Skeleton);
        }
        return this._raise_jackpotFX;
    }

    public onPlay() {
        let self = this;
        let animName: string;
        for (let i = 0; i < self.raise_jackpotFX.length; i++) {
            animName = self.raise_jackpotFX[i].animation;

            self.raise_jackpotFX[i].node.active = true;

            self.raise_jackpotFX[i].setAnimation(0, animName, false);

            self.raise_jackpotFX[i].setCompleteListener(() => {
                self.raise_jackpotFX[i].node.active = false;
            });
        }
    }
}
