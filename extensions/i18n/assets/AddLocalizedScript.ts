import { _decorator, Component, Label, Sprite, sp } from 'cc';
import { LocalizedSprite } from './LocalizedSprite';
import { LocalizedLabel } from './LocalizedLabel';
import { LocalizedPosition } from './LocalizedPosition';
import { LocalizedSkeleton } from './LocalizedSkeleton';
const { ccclass, executeInEditMode, menu } = _decorator;

@ccclass('AddLocalizedScript')
@executeInEditMode
@menu('i18n/AddLocalizedScript')
export class AddLocalizedScript extends Component {
    onEnable() {
        if(this.getComponent(Sprite)) {
            this.addComponent(LocalizedSprite);
        }
        else if(this.getComponent(Label)) {
            this.addComponent(LocalizedLabel);
        }
        else if(this.getComponent(sp.Skeleton)) {
            const skeleton = this.getComponent(sp.Skeleton);
            const skeletonData = skeleton.skeletonData;
            skeleton._destroyImmediate();
            let localizedSkeleton = this.addComponent(LocalizedSkeleton);
            localizedSkeleton.skeletonData = skeletonData;
        }
        else {
            this.addComponent(LocalizedPosition);
        }
        this.destroy();
    }
}