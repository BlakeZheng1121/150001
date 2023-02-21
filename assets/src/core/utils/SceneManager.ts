import { _decorator, Component, game, view, ResolutionPolicy, Prefab, instantiate, tween, Vec3, director } from 'cc';
import { AppFacade } from '../AppFacade';
import { CoreWebBridgeProxy } from '../proxy/CoreWebBridgeProxy';
import { Logger } from './Logger';

export let DEF_STAGE_WIDTH = undefined;
export let DEF_STAGE_HEIGHT = undefined;
// 直式背景出血最大解析度
export let DEF_MAX_HEIGHT = 2000;

const { ccclass, property } = _decorator;

export enum Orientation {
    HORIZONTAL = 'EV_ORIENTATION_HORIZONTAL',
    VERTICAL = 'EV_ORIENTATION_VERTICAL'
}

export enum ContainerJPButtonVertical {
    ICON = 50,
    HISTORY = 113
}
export enum ContainerJPButtonHorizontal {
    ICON = 50,
    HISTORY = 113
}

@ccclass('SceneManager')
export class SceneManager extends Component {
    public static EV_ORIENTATION_VERTICAL: string = 'EV_ORIENTATION_VERTICAL';
    public static EV_ORIENTATION_HORIZONTAL: string = 'EV_ORIENTATION_HORIZONTAL';
    private screenHeight: number;
    private screenWidth: number;
    private screenAngle: number;
    private isOrientationSuccess: boolean;
    private policy: ResolutionPolicy;

    private static _orientation: Orientation = Orientation.VERTICAL;
    public static get Orientation() {
        return this._orientation;
    }

    private static set Orientation(orientation: Orientation) {
        this._orientation = orientation;
    }

    @property({ type: Prefab })
    public prefabMockTool: Prefab;

    public static instance: SceneManager = null;

    protected onLoad() {
        if (SceneManager.instance === null) {
            SceneManager.instance = this;
            game.addPersistRootNode(this.node);
        } else {
            this.destroy();
            return;
        }

        // 解析度自適應設定
        this.policy = new ResolutionPolicy(
            ResolutionPolicy.ContainerStrategy.PROPORTION_TO_FRAME,
            ResolutionPolicy.ContentStrategy.SHOW_ALL
        );
        this.screenHeight = 0;
        this.screenWidth = 0;
        this.screenAngle = 0;
        this.isOrientationSuccess = true;
        /** listen orientation event */
        window.onresize = () => this.onChangeScreen();

        DEF_STAGE_WIDTH = view.getDesignResolutionSize().width;
        DEF_STAGE_HEIGHT = view.getDesignResolutionSize().height;
        this.onChangeScreen();

        /** Release 不能包含 mock */
        // TODO: 因應測試需求先註解，待mock打包機制完成
        // if (DEBUG) {
        instantiate(this.prefabMockTool).setParent(this.node);
        // }
    }

    /**
     * 判斷是否該轉向
     *
     * @param evt 畫面轉動時的事件
     */
    private onChangeScreen(evt: UIEvent = undefined): void {
        const self = this;
        if (self.node) {
            const screenHeight = window.innerHeight;
            const screenWidth = window.innerWidth;
            if (screenHeight != self.screenHeight || screenWidth != self.screenWidth || !self.isOrientationSuccess) {
                self.screenHeight = screenHeight;
                self.screenWidth = screenWidth;
                // 固定直式縮放比例
                this.onVerticalResize(evt);
            }
        } else {
            Logger.w('WebPlayer is not exist');
        }
    }

    /**
     * 設置直式比例的解析度 (專案預設需為直式)
     * 直式比例一般為 9:16
     * 為了背景出血，最多顯示 9:20
     * @param evt 畫面轉動時的事件
     */
    private onVerticalResize(evt: UIEvent = undefined): void {
        let ratio = this.screenHeight / this.screenWidth;
        let frameHeight = 0;
        let frameLongSide = DEF_STAGE_WIDTH > DEF_STAGE_HEIGHT ? DEF_STAGE_WIDTH : DEF_STAGE_HEIGHT;
        let frameShortSide = DEF_STAGE_WIDTH > DEF_STAGE_HEIGHT ? DEF_STAGE_HEIGHT : DEF_STAGE_WIDTH;
        if (ratio < 1.77) {
            frameHeight = frameLongSide;
        } else if (ratio < 2.22) {
            frameHeight = Math.round(ratio * frameShortSide);
        } else {
            frameHeight = DEF_MAX_HEIGHT;
        }

        if (screen.orientation != undefined) {
            if (this.screenAngle != screen.orientation.angle) {
                this.screenAngle = screen.orientation.angle;
                this.callContainerResize(this.screenAngle);
            }
        }

        view.setDesignResolutionSize(frameShortSide, frameHeight, this.policy);
    }

    private callContainerResize(screenAngle: number) {
        let jpHallPosY;
        let jpHistoryPosY;
        if (screenAngle == 90 || screenAngle == -90) {
            jpHallPosY = ContainerJPButtonHorizontal.ICON;
            jpHistoryPosY = ContainerJPButtonHorizontal.HISTORY;
        } else {
            jpHallPosY = ContainerJPButtonVertical.ICON;
            jpHistoryPosY = ContainerJPButtonVertical.HISTORY;
        }

        const webBridgeProxy = AppFacade.instance.retrieveProxy(CoreWebBridgeProxy.NAME) as CoreWebBridgeProxy;
        webBridgeProxy.getWebFunRequest(this, 'gameClientMsg', {
            event: 'customButtonPosition',
            value: {
                jpHall: {
                    y: jpHallPosY,
                    horizontalRotate: screenAngle
                },
                jpHistory: {
                    y: jpHistoryPosY,
                    horizontalRotate: screenAngle
                }
            }
        });
    }

    public shakeScreen() {
        this.shake('View/Common-Panel/Base_Reel_View');
        this.shake('View/Game_2/Expansion_Wilds_View');
    }

    public shake(url) {
        let target = director.getScene().getChildByPath(url);

        tween(target)
            .by(0.02, { position: new Vec3(5, 7, 0) })
            .by(0.02, { position: new Vec3(-11, 0, 0) })
            .by(0.02, { position: new Vec3(-7, -4, 0) })
            .by(0.02, { position: new Vec3(16, -9, 0) })
            .by(0.02, { position: new Vec3(-8, 11, 0) })
            .by(0.02, { position: new Vec3(7, -13, 0) })
            .by(0.02, { position: new Vec3(-10, -2, 0) })
            .by(0.02, { position: new Vec3(11, 20, 0) })
            .by(0.02, { position: new Vec3(-3, -10, 0) })
            .delay(0.2)
            .by(0.02, { position: new Vec3(5, 7, 0) })
            .by(0.02, { position: new Vec3(-11, 0, 0) })
            .by(0.02, { position: new Vec3(-7, -4, 0) })
            .by(0.02, { position: new Vec3(16, -9, 0) })
            .by(0.02, { position: new Vec3(-8, 11, 0) })
            .by(0.02, { position: new Vec3(7, -13, 0) })
            .by(0.02, { position: new Vec3(-10, -2, 0) })
            .by(0.02, { position: new Vec3(11, 20, 0) })
            .by(0.02, { position: new Vec3(-3, -10, 0) })
            .start();
    }
}
