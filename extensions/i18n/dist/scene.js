'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.unload = exports.load = void 0;
function load() { }
exports.load = load;
function unload() { }
exports.unload = unload;
exports.methods = {
    queryCurrentLanguage() {
        const win = window;
        return win._languageData.language;
    },
    changeCurrentLanguage(lang) {
        const win = window;
        debugger;
        win._languageData.init(lang);
        win._languageData.updateSceneRenderers();
        // @ts-ignore
        cce.Engine.repaintInEditMode();
    },
    cacheSpriteUuid() {
        const win = window;
        debugger;
        win._languageData.cacheSpriteUuid();
        // @ts-ignore
        cce.Engine.repaintInEditMode();
    },
    cleanSpriteRef() {
        const win = window;
        debugger;
        win._languageData.cleanSpriteRef();
        // @ts-ignore
        cce.Engine.repaintInEditMode();
    },
    restoreSprite() {
        const win = window;
        debugger;
        win._languageData.restoreSprite();
        // @ts-ignore
        cce.Engine.repaintInEditMode();
    }
};
