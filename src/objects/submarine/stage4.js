import Submarine from "@/objects/submarine";

export default class SubmarineStage4 extends Submarine {
	constructor(scene) {
		super(scene);


		this.init();
	}

	amFiring() {
		for(const weapon of this.weapons) {
			if(weapon.firing) return true;
		}

		return false;
	}

	canFire() {
		return super.canFire();
	}

	findClosestWeaponToCursor() {

	}
}