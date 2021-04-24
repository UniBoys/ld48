import Submarine from "@/objects/submarine";
import Spear1 from "@/objects/weapons/spear1";

export default class SubmarineStage1 extends Submarine {
	constructor(scene) {
		super(scene);

		this.weapons = [
			new Spear1({scene, submarine: this, relativeX: 60, relativeY: 100, defaultAngle: 90, minAngle: 80, maxAngle: 140, upIsUp: true}),
			new Spear1({scene, submarine: this, relativeX: 190, relativeY: 100, defaultAngle: 90, minAngle: 40, maxAngle: 100, upIsUp: true})
		]

		this.init();
	}
}