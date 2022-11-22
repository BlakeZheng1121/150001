"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.onAfterBuild = exports.onAfterCompressSettings = exports.onBeforeCompressSettings = exports.onBeforeBuildAssets = exports.onBeforeBuild = exports.load = exports.throwError = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const PACKAGE_NAME = 'cocos-build-template';
function log(...arg) {
    return console.log(`[${PACKAGE_NAME}] `, ...arg);
}
let allAssets = [];
exports.throwError = true;
function load() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] Load cocos plugin example in builder.`);
        allAssets = yield Editor.Message.request('asset-db', 'query-assets');
    });
}
exports.load = load;
function onBeforeBuild(options) {
    return __awaiter(this, void 0, void 0, function* () {
        // Todo some thing
        log(`${PACKAGE_NAME}.webTestOption`, 'onBeforeBuild');
        if (options.packages[PACKAGE_NAME].develop == false) {
            yield deleteMock();
            yield removeReference();
            yield Editor.Message.request('asset-db', 'reimport-asset', options.startScene);
            yield Editor.Message.request('asset-db', 'refresh-asset', options.startScene);
        }
    });
}
exports.onBeforeBuild = onBeforeBuild;
function deleteMock() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let path = (0, path_1.join)(Editor.Project.path, 'assets/src/core/utils/SceneManager.ts');
            fs_1.default.readFile(path, 'utf8', (err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return reject(err);
                fs_1.default.writeFile(path, data.replace('instantiate(this.prefabMockTool).setParent(this.node);', ''), (err) => {
                    if (err)
                        return reject(err);
                    resolve();
                });
            }));
        });
    });
}
function removeReference() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let path = (0, path_1.join)(Editor.Project.path, 'assets/scenes/LoadScene.scene');
            fs_1.default.readFile(path, 'utf8', (err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    return reject(err);
                if (data.includes('bbdb3f2d-f9d4-46fd-b61b-e44579664e9f')) {
                    const mockStartIndex = data.indexOf('prefabMockTool');
                    const mockLeftIndex = data.indexOf('{', mockStartIndex);
                    const mockRightIndex = data.indexOf('}', mockStartIndex);
                    data = data
                        .slice(0, mockLeftIndex - 1)
                        .concat('null')
                        .concat(data.slice(mockRightIndex + 1));
                    fs_1.default.writeFile(path, data, (err) => {
                        if (err)
                            return reject(err);
                        resolve();
                    });
                }
                else {
                    resolve();
                }
            }));
        });
    });
}
function onBeforeBuildAssets(options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        // Todo some thing
        log(`${PACKAGE_NAME}.webTestOption`, 'onBeforeBuildAssets');
    });
}
exports.onBeforeBuildAssets = onBeforeBuildAssets;
function onBeforeCompressSettings(options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        const pkgOptions = options.packages[PACKAGE_NAME];
        if (pkgOptions.webTestOption) {
            console.debug('webTestOption', true);
        }
        // Todo some thing
        console.debug('get settings test', result);
    });
}
exports.onBeforeCompressSettings = onBeforeCompressSettings;
function onAfterCompressSettings(options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        // Todo some thing
        console.log('webTestOption', 'onAfterCompressSettings');
    });
}
exports.onAfterCompressSettings = onAfterCompressSettings;
function onAfterBuild(options, result) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.onAfterBuild = onAfterBuild;
function unload() {
    console.log(`[${PACKAGE_NAME}] Unload cocos plugin example in builder.`);
}
exports.unload = unload;
