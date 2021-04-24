import Submarine from "@/objects/submarine";
import Cannon from "@/objects/weapons/cannon";

export default class SubmarineStage3 extends Submarine {
	constructor(scene) {
		super(scene);
		
		this.obj = this.scene.add.rectangle(this.initX, this.initY, this.width, this.height, this.color);

		this.weapons = [
			new Cannon({scene, submarine: this, relativeX: 60, relativeY: 130, defaultAngle: 90, minAngle: 60, maxAngle: 150}),
			new Cannon({scene, submarine: this, relativeX: 190, relativeY: 130, defaultAngle: 90, minAngle: 30, maxAngle: 120})
		]

		this.init();
	}
}