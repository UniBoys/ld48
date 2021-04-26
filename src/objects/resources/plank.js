import Resource from "@/objects/resource";

export default class Plank extends Resource {
	constructor(scene, x, y, disposing) {
		super({
			scene,
			x,
			y,
			width: 924/8,
			height: 1157/8,
			disposing,
		});

		this.name = "plank";
		this.addName = "wood";
		this.variance = 1;
		this.partWidth = 70;
		this.partHeight = 70;
		this.partAmount = 3;

		this.freeFloatTime = 2000;
		this.partRotateSpeed = 0.3;

		this.init();
	}
}