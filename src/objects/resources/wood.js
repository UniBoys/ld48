import Resource from "@/objects/resource";

export default class Wood extends Resource {
	constructor(scene, x, y, disposing) {
		super({
			scene,
			x,
			y,
			width: 1533/9,
			height: 1181/9,
			disposing,
		});

		this.name = "wood";
		this.variance = 1;
		this.partWidth = 70;
		this.partHeight = 70;
		this.partAmount = 3;

		this.freeFloatTime = 2000;
		this.partRotateSpeed = 0.3;

		this.init();
	}

	sound() {
		const sound = this.scene.sound.add('wood');
		sound.setVolume(.2)
		sound.play();
	}
}