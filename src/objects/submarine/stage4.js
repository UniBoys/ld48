import Submarine from "@/objects/submarine";
import Missile from "@/objects/weapons/missile";

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

		this.acceleration = 16;
		this.deceleration = 12;
        this.changeBonus = 1.7;
		this.maxSpeedX = 280;
		this.maxSpeedY = 220;

		this.signX = 125;
		this.signY = -10;
		this.signR = 2;
		this.signW = 60;
		this.signH = 9;

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

		this.init();
	}

	amFiring() {
		for(const weapon of this.weapons) {
			if(weapon.firing) return true;
		}

		return false;
	}

	canFire() {
		return super.canFire() && !this.amFiring();
	}

	findClosestWeaponToCursor() {
		if(this.weapons[0].reloading) {
			return this.weapons[1];
		}
		else {
			return this.weapons[0];
		}
	}

	updateBobbingX(time) {
		if(time == 0) this.obj.play("sub4-move")
		else this.obj.play("sub4-idle")
	}
}