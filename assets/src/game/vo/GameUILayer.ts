import { _decorator, Component, Node, Enum } from 'cc';
import { UILayer } from '../../core/ui/UILayer';
import { Layer } from '../../sgv3/vo/enum/Layer';
const { ccclass, property } = _decorator;

@ccclass('GameUILayer')
export class GameUILayer extends UILayer {
    @property({ type: Enum(Layer), visible: true })
    public horizontalLayer: Layer = 0;

    @property({ type: Enum(Layer), visible: true })
    public verticalLayer: Layer = 0;

    public changeOrientation(isHorizontal: boolean) {
        let layerID = this.horizontalLayer;

        if (isHorizontal) layerID = this.horizontalLayer;
        else layerID = this.verticalLayer;

        for (let i in this.uiLayer) {
            this.uiLayer[i].layer = layerID;
        }
    }
}
