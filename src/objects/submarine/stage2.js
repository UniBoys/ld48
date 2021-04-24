import Submarine from "@/objects/submarine";
import Spear2 from "@/objects/weapons/spear2";

export default class SubmarineStage2 extends Submarine {
	constructor(scene) {
		super(scene);

		this.obj = this.scene.add.rectangle(this.initX, this.initY, this.width, this.height, this.color);

		this.weapons = [
			new Spear2({scene, submarine: this, relativeX: 60, relativeY: 125, defaultAngle: 160, minAngle: 105, maxAngle: 175, left: true}),
			new Spear2({scene, submarine: this, relativeX: 190, relativeY: 125, defaultAngle: 20, minAngle: 5, maxAngle: 75, left: false})
		]

		this.init();
	}
}