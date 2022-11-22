'use strict';

export function load() {}
export function unload() {}

export const methods = {
    queryCurrentLanguage() {
        const win = window as any;
        return win._languageData.language;
    },
    changeCurrentLanguage(lang: string) {
        const win = window as any;
        debugger;
        win._languageData.init(lang);
        win._languageData.updateSceneRenderers();
        // @ts-ignore
        cce.Engine.repaintInEditMode();
    },
    cacheSpriteUuid() {
        const win = window as any;
        debugger;
        win._languageData.cacheSpriteUuid();
        // @ts-ignore
        cce.Engine.repaintInEditMode();
    },
    cleanSpriteRef() {
        const win = window as any;
        debugger;
        win._languageData.cleanSpriteRef();
        // @ts-ignore
        cce.Engine.repaintInEditMode();
    },
    restoreSprite() {
        const win = window as any;
        debugger;
        win._languageData.restoreSprite();
        // @ts-ignore
        cce.Engine.repaintInEditMode();
    }
};