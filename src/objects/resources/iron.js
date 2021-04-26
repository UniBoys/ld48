import Resource from "@/objects/resource";

export default class Gold extends Resource {
	constructor(scene, x, y, disposing) {
		super({
			scene,
			x,
			y,
			width: 150,
			height: 60,
			disposing,
		});

		this.name = "iron";
		this.variance = 2;
		this.partWidth = 70;
		this.partHeight = 70;
		this.partAmount = 3;

		this.init();
	}

	sound() {
		const sound = this.scene.sound.add('ore');
		sound.setVolume(20)
		sound.play();
	}
}