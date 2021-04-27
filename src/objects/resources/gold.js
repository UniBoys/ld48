import Resource from "@/objects/resource";
import layers from "@/layers";

export default class Iron extends Resource {
	constructor(scene, x, y, disposing) {
		super({
			scene,
			x,
			y,
			width: 861/6,
			height: 744/6,
			disposing,
		});

		this.obj = scene.add.sprite(x, y);
		this.obj.play('chest-idle')

		this.name = "gold";
		this.addName = "treasure";
		this.variance = 1;
		this.partWidth = 70;
		this.partHeight = 70;
		this.partAmount = 3;

		this.init();
	}

	gather() {
		this.obj.play('chest-open')

		for(var i = 1; i <= this.partAmount; i++) {
			this.createPart(i);
		}

		this.scene.physics.add.collider(this.parts, this.scene.submarine.obj, (object1, object2) => {
			object1.destroy();
			this.parts = this.parts.filter(part => part !== object1);
			this.scene.submarine.inventory.add(this.addName, this.amount / 3);
		})
		
		this.gathering = true;
	}

	sound() {
		const sound = this.scene.sound.add('chest');
		sound.setVolume(.5)
		sound.play();
	}
}