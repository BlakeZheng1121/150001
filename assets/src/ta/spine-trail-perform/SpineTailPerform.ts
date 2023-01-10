import { _decorator, Component, Prefab, Node, CCInteger } from 'cc';
import { PoolManager } from '../../sgv3/PoolManager';
import { CocosAnimationMultiTool } from '../tool/cocos-animation-tool/CocosAnimationMultiTool';

const { ccclass, property } = _decorator;

@ccclass('SpineTailPerform')
export class SpineTailPerform extends Component {
    @property({ type: Node, visible: true })
    public effectTarget: Node | null = null;
    @property({ type: Prefab, visible: true })
    public trailPrefab: Prefab | null = null;

    public spineDragonTrailHit: CocosAnimationMultiTool[] = [];

    public spineDragonTrail: CocosAnimationMultiTool[] = [];

    private listIndex: number = 0;

    private HitBackID: number = 0;

    private TRAIL_STRING: String = String('Trail'); // trail of DragonBall hit

    private MINI_ENTRY_STRING: String = String('MiniEntry'); // miniGame explosive items

    private dragonBallPos: Array<number> = [10, 5, 0, 11, 6, 1, 12, 7, 2, 13, 8, 3, 14, 9, 4]; // symbol items pos (3 X 5)
    private miniEntryPos: Array<number> = [8, 4, 0, 9, 5, 1, 10, 6, 2, 11, 7, 3]; // miniGame items pos (3 X 4)

    public UpdateAnimationObjectID(index: number) {
        let trail: CocosAnimationMultiTool = PoolManager.instance
            .getNode(this.trailPrefab, this.node)
            .getComponent(CocosAnimationMultiTool);

        this.listIndex = index;
        trail.SpineAnimationIndex = [String(this.TRAIL_STRING) + this.dragonBallPos[this.listIndex]];

        this.spineDragonTrail.push(trail);
    }

    public SpineTrailEffect() {
        this.spineDragonTrail[this.spineDragonTrail.length - 1].OnPlay(0, () => this.spineDragonTrailHitPerform());

        this.scheduleOnce(() => {
            let trail = this.spineDragonTrail.shift();
            PoolManager.instance.putNode(trail.node);
        }, 1);
    }

    public SpineFreeTrailEffect(cb: any | null = null) {
        this.spineDragonTrail[this.spineDragonTrail.length - 1].OnPlay(0);

        this.scheduleOnce(() => {
            let trail = this.spineDragonTrail.shift();
            PoolManager.instance.putNode(trail.node);
        }, 1);
    }

    public SpineMiniEffect(index: number) {
        let trail: CocosAnimationMultiTool = PoolManager.instance
            .getNode(this.trailPrefab, this.node)
            .getComponent(CocosAnimationMultiTool);

        trail.SpineAnimationIndex = [String(this.MINI_ENTRY_STRING) + this.miniEntryPos[index]];

        this.spineDragonTrail.push(trail);

        this.scheduleOnce(() => trail.OnPlay(0), Math.random() * 0.5);

        this.scheduleOnce(() => {
            let trail = this.spineDragonTrail.shift();
            PoolManager.instance.putNode(trail.node);
        }, 3);
    }

    private spineDragonTrailHitPerform() {
        var spineDragonTrailHitAnimatID = Math.floor(Math.random() * 5);
        this.spineDragonTrailHit[this.HitBackID]?.OnPlay(spineDragonTrailHitAnimatID);
        this.HitBackID++;
        if (this.HitBackID > 1) {
            this.HitBackID = 0;
        }
    }
}
