
import { _decorator, Component, Sprite, assetManager, ImageAsset, SpriteFrame, Texture2D } from 'cc';
import { ServiceProvider } from '../vo/NetworkType';
const { ccclass, property } = _decorator;

 
@ccclass('UrlLogoSetting')
export class UrlLogoSetting extends Component {
    //region Internal Member
    @property({ type: Sprite, visible: true })
    private _logo: Sprite | null = null;
    @property({ type: String, visible: true })
    private _url: String = String();
    //endregion
  
    //region Property
    public get url(): String {
        return this._url;
    }

    public set url(value: String) {
        this._url = value;
    }
    //endregion
  
    //region API
    public updateFrame() {
        const self = this;
        if(self.url == undefined || self.url.length == 0) {
            return;
        }
        let remoteUrl = String(self.url);
        assetManager.loadRemote<ImageAsset>(remoteUrl, function (err, imageAsset) { 
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrame.texture = texture;
            self._logo.spriteFrame = spriteFrame;
        });
    }
    //endregion
  
    //region Internal Method
    onLoad(){
        this.updateFrame();
    }
    //endregion
}
