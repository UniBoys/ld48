import Resource from "@/objects/resource";

export default class Wood extends Resource {
	constructor(scene, x, y, width, height) {
		super({
			scene,
			x,
			y,
			width,
			height
		})

		this.rotation = 0;
		
		this.obj = this.scene.add.rectangle(this.x, this.y, this.width, this.height, 0xffffff);
        this.scene.physics.add.existing(this.obj);
		this.obj.setAngle(this.rotation - 90);
		this.obj.depth = 8;
	}

	gather() {
		
	}
}