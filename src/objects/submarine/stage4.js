import Submarine from "@/objects/submarine";
import Missile from "@/objects/weapons/missile";
import HeadLight from "@/objects/submarine/headLight";

export default class SubmarineStage4 extends Submarine {
    constructor(scene) {
        super(scene, 4);

        this.obj = scene.add.sprite(this.initX, this.initY);
        this.obj.setScale(0.20)
        this.obj.play("sub4-idle")

        this.hitboxSizeX = 0.9;
        this.hitboxSizeY = 0.35;
        this.hitboxOffsetX = -20;
        this.hitboxOffsetY = 63;

        this.acceleration = 9;
        this.deceleration = 7;
        this.changeBonus = 1.5;
        this.maxSpeedX = 160;
        this.maxSpeedY = 120;

        this.signX = 125;
        this.signY = -10;
        this.signR = 2;
        this.signW = 60;
        this.signH = 9;

        this.inventorySetting.size = 600;

        this.weapons = [
            new Missile({
                scene,
                submarine: this,
                left: {relativeX: 30, relativeY: 65, defaultAngle: 0},
                right: {relativeX: 170, relativeY: 65, defaultAngle: 180},
                radian: 1
            }),
            new Missile({
                scene,
                submarine: this,
                left: {relativeX: 160, relativeY: 65, defaultAngle: 0},
                right: {relativeX: 40, relativeY: 65, defaultAngle: 180},
                radian: 2
            }),
        ]

        this.depthDamage = [
            {y1: 0, y2: 6000, amount: 1},
        ]

        this.headLights = [
            new HeadLight({
                scene,
                submarine: this,
                left: {relativeX: 260, relativeY: 40, a1: 180, a2: 110},
                right: {relativeX: 40, relativeY: 40, a1: 0, a2: 70}
            }),
            new HeadLight({
                scene,
                submarine: this,
                left: {relativeX: 260, relativeY: 40, a1: -180, a2: -110},
                right: {relativeX: 40, relativeY: 40, a1: -70, a2: 0}
            }),
        ]

        this.init();
    }

    amFiring() {
        for (const weapon of this.weapons) {
            if (weapon.firing) return true;
        }

        return false;
    }

    canFire() {
        return super.canFire() && !this.amFiring();
    }

    findClosestWeaponToCursor() {
        if (this.weapons[0].reloading) {
            return this.weapons[1];
        } else {
            return this.weapons[0];
        }
    }

    updateBobbingX(time) {
        if (time == 0) this.obj.play("sub4-move")
        else this.obj.play("sub4-idle")
    }
}