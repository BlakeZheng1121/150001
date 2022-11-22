import * as i18n from './LanguageData';

import { _decorator, Sprite, SpriteFrame, assetManager, Component } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('LocalizedSprite')
@executeInEditMode
export class LocalizedSprite extends Component {
    @property({
        readonly: true,
        visible: true
    })
    private spriteUrl: string = '';

    private _sprite: Sprite = null;
    private get sprite() {
        if (!this._sprite) {
            this._sprite = this.getComponent(Sprite) ?? this.addComponent(Sprite);
        }
        return this._sprite;
    }

    public onLoad() {
        // @ts-ignore
        if (!CC_EDITOR) {
            if (!i18n.ready) {
                // i18n.init('en');
                return;
            }
            this.updateSprite();
        }
    }

    public onEnable() {
        // @ts-ignore
        if (CC_EDITOR) {
            this.addListener();
            if (this.sprite.spriteFrame) {
                this.cachePath(this.sprite);
            }
        }
    }

    async updateSprite() {
        // @ts-ignore
        if (CC_EDITOR) {
            this.removeListener();
            i18n._language;
            let uuid = await Editor.Message.request('asset-db', 'query-uuid', eval('`' + this.spriteUrl + '`'));
            let spriteFrame = new SpriteFrame();
            spriteFrame.initDefault(uuid);
            this.sprite.spriteFrame = spriteFrame;
            this.addListener();
        } else {
            this.downloadBundle()
                .then((bundle) => this.loadSprite(bundle))
                .catch((err) => console.error(err));
        }
    }

    downloadBundle() {
        return new Promise((resolve, reject) => {
            if (assetManager.bundles.has(i18n._language)) {
                return resolve(assetManager.bundles.get(i18n._language));
            }
            assetManager.loadBundle(i18n._language, (err, bundle) => {
                if (err) {
                    return reject(err);
                }
                resolve(bundle);
            });
        });
    }

    loadSprite(bundle) {
        return new Promise<void>((resolve, reject) => {
            // db://assets/art/language/${i18n._language}/xxx/yyy.png@zzzzz
            // 1. 將i18n._language帶入 db://assets/art/language/en/xxx/yyy.png@zzzzz
            // 2. 將多國語系前面刪除 xxx/yyy.png@zzzzz
            // 3. 將.png後移除 xxx/yyy
            // 4. 補上spriteFrame檔 xxx/yyy/spriteFrame
            let path = this.spriteUrl
                    .split("${i18n._language}/")[1]
                    .split('.png')[0] + '/spriteFrame';
            bundle.load(path, SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    return reject(err);
                }
                this.sprite.spriteFrame = spriteFrame;
                resolve();
            });
        });
    }

    private async cachePath(comp: Sprite) {
        if (!comp || !comp.spriteFrame) return;
        this.spriteUrl = await Editor.Message.request('asset-db', 'query-url', comp.spriteFrame._uuid);
        this.processPath();
    }

    private processPath() {
        //db://assets/resources/language/en/xxxxxx
        // console.log(this.spriteUrl);
        // const regex = 'language/[a-z]+/\\w+';
        // this.spriteUrl = this.spriteUrl.slice(this.spriteUrl.search(regex));
        const splitArray = this.spriteUrl.split('/');
        this.spriteUrl = this.spriteUrl.replace(splitArray[splitArray.indexOf('language') + 1], '${i18n._language}'); //.split('@')[0];
    }

    public onDisable() {
        // @ts-ignore
        if (CC_EDITOR) {
            this.removeListener();
        }
    }

    private addListener() {
        this.node.on(Sprite.EventType.SPRITE_FRAME_CHANGED, (comp: Sprite) => this.cachePath(comp), this);
    }

    private removeListener() {
        this.node.off(Sprite.EventType.SPRITE_FRAME_CHANGED, (comp: Sprite) => this.cachePath(comp));
    }
}