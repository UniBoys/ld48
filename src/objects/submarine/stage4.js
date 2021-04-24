import Submarine from "@/objects/submarine";
import Missile from "@/objects/weapons/missile";

export default class SubmarineStage4 extends Submarine {
	constructor(scene) {
		super(scene);

		this.weapons = [
			new Missile({scene, submarine: this, relativeX: 60, relativeY: 125, defaultAngle: 0}),
			new Missile({scene, submarine: this, relativeX: 190, relativeY: 125, defaultAngle: 0})
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
}