import Resource from "@/objects/resource";

export default class Iron extends Resource {
	constructor(scene, x, y) {
		super({
			scene,
			x,
			y,
			width: 150,
			height: 60
		});

		this.name = "iron";
		this.partWidth = 70;
		this.partHeight = 70;

		this.init();
	}
}