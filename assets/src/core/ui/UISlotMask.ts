import { _decorator, Component, Camera, RenderTexture, gfx, view, Sprite, Vec2, Material, CCFloat, Vec3 } from 'cc';
import { DEF_MAX_HEIGHT, DEF_STAGE_HEIGHT, DEF_STAGE_WIDTH } from '../utils/SceneManager';
const { ccclass, property } = _decorator;

@ccclass('SlotMaskDisplayModeSetting')
export class SlotMaskDisplayModeSetting {
    @property({ type: CCFloat, visible: true })
    public orthoHeight = 0;
    @property({ visible: true })
    public position = new Vec3();
}

@ccclass('UISlotMask')
export class UISlotMask extends Component {
    // 用來擷取遮罩範圍的參考圖
    @property({ type: Camera })
    public baseCam: Camera;
    @property({ type: SlotMaskDisplayModeSetting, visible: true })
    private _horizontalDisplaySetting: SlotMaskDisplayModeSetting = new SlotMaskDisplayModeSetting();
    @property({ type: SlotMaskDisplayModeSetting, visible: true })
    private _verticalDisplaySetting: SlotMaskDisplayModeSetting = new SlotMaskDisplayModeSetting();

    // 遮罩範圍的參考圖，以相同的 sprite color 作為可渲染的範圍
    private baseMap: RenderTexture;

    private sharedMaterial: Material | null = null;

    private pi: gfx.RenderPassInfo | null = null;

    private isHorizontalMode: boolean = false;
    // Render texture 尺寸
    private screenHeight: number;
    private screenWidth: number;
    // 遊戲畫面的尺寸
    private viewSize: Vec2 = new Vec2(0, 0);

    protected onLoad() {
        const self = this;
        // 直接監聽視窗縮放事件，避免來不及調整 Mask 尺寸導致出現破綻
        window.addEventListener('resize', () => {
            let isHorizontal = false; // window.matchMedia('(orientation: landscape)').matches;
            self.updateTexture(isHorizontal);
        });
    }

    public maskInit(Material: Material) {
        this.sharedMaterial = Material;
        // 新增 Render texture
        const colorAttachment = new gfx.ColorAttachment();
        colorAttachment.loadOp = gfx.LoadOp.CLEAR;
        colorAttachment.format = gfx.Format.RGBA8;

        const depthStencilAttachment = new gfx.DepthStencilAttachment();
        this.pi = new gfx.RenderPassInfo([colorAttachment], depthStencilAttachment);
        let isHorizontal = false; // window.matchMedia('(orientation: landscape)').matches;
        this.updateTexture(isHorizontal, true);
    }

    public updateTexture(isHorizontal: boolean = true, isInit: boolean = false) {
        if (this.sharedMaterial == null) {
            return;
        }
        this.enabledCamera(true);
        if (this.isHorizontalMode != isHorizontal || isInit == true) {
            this.isHorizontalMode = isHorizontal;
            this.node.position = this.isHorizontalMode
                ? this._horizontalDisplaySetting.position
                : this._verticalDisplaySetting.position;
            let frameLongSide = DEF_STAGE_WIDTH > DEF_STAGE_HEIGHT ? DEF_STAGE_WIDTH : DEF_STAGE_HEIGHT;
            let frameShortSide = DEF_STAGE_WIDTH > DEF_STAGE_HEIGHT ? DEF_STAGE_HEIGHT : DEF_STAGE_WIDTH;
            if (isHorizontal) {
                // 橫式比例為 16:9
                this.screenWidth = frameLongSide;
                this.screenHeight = frameShortSide;
            } else {
                // 直式比例為 20:9，以達到背景出血效果
                this.screenWidth = frameShortSide;
                this.screenHeight = DEF_MAX_HEIGHT;
            }
            if (this.baseMap == null) {
                this.baseMap = new RenderTexture();
                // 設定 Render texture 的大小，直橫式轉換需重新 resize
                this.baseMap.reset({
                    name: 'baseMap',
                    width: this.screenWidth,
                    height: this.screenHeight,
                    passInfo: this.pi
                });
                // 指定 Render texture 做為參考圖，在 onLoad 會取不到 sharedMaterial
                this.sharedMaterial.setProperty('baseMap', this.baseMap);
                this.baseCam.targetTexture = this.baseMap;
            } else {
                this.baseMap.resize(this.screenWidth, this.screenHeight);
            }
        }

        if (
            this.viewSize.x != view.getDesignResolutionSize().width ||
            this.viewSize.y != view.getDesignResolutionSize().height
        ) {
            this.viewSize.x = view.getDesignResolutionSize().width;
            this.viewSize.y = view.getDesignResolutionSize().height;
            // 直式需動態調整攝影機參數
            this.baseCam.orthoHeight =
                this.viewSize.x > this.viewSize.y
                    ? this._horizontalDisplaySetting.orthoHeight
                    : Math.round((this.viewSize.y * 0.5) / this.node.parent.scale.y);
            // 指定遊戲畫面的大小，直橫式轉換需重新設定
            this.sharedMaterial.setProperty('viewSize', this.viewSize);
        }
        this.scheduleOnce(()=>this.enabledCamera(false), 0);
    }

    private enabledCamera (enabled: boolean) {
        this.baseCam.enabled = enabled;
    } 
}
