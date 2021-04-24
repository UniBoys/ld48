import Resource from "@/objects/resource";

export default class Wood extends Resource {
	constructor({scene, width, height, x, y}) {
		super({
			scene,
			x,
			y,
			width,
			height
		})

		this.obj = this.scene.add.rectangle(submarine.initX + relativeX, submarine.initY + relativeY, this.width, this.height, 0xffffff);
        this.scene.physics.add.existing(this.obj);
		this.obj.setAngle(this.rotation - 90);
		this.obj.depth = 8;
	}
}