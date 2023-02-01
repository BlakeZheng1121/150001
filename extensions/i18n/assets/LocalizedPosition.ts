import * as i18n from './LanguageData';

import { _decorator, Vec3 } from 'cc';
import { BaseLocalized } from './BaseLocalized';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('LocalizedPositionInfo')
class LocalizedPositionInfo {
    @property
    language: string = 'en';
    @property({
        type: Vec3
    })
    position: Vec3 = new Vec3();
}

@ccclass('LocalizedPosition')
@executeInEditMode
export class LocalizedPosition extends BaseLocalized {
    @property({
        type: LocalizedPositionInfo
    })
    positionList: Array<LocalizedPositionInfo> = [];

    get localizedPositionInfo() {
        return this.positionList.find((item) => item.language === i18n._language);
    }

    onLoad() {
        if (!i18n.ready) {
            // i18n.init('en');
            return;
        }
        this.updateRenderer();
    }

    updateRenderer() {
        if (this.localizedPositionInfo) {
            this.node.position = this.localizedPositionInfo.position;
        }
    }
}
