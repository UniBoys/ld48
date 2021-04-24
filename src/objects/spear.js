export default class Spear {
	constructor({relativeX}) {
		this.relativeX = 50;
		this.relativeY = 140;
		this.width = 20;
		this.height = 40;
	}

	update() {
		this.obj.body.x = this.scene.submarine.obj.body.x;
		this.obj.body.y = this.scene.submarine.obj.body.y;

		this.obj.body.x += this.relativeX
		this.obj.body.y += this.relativeY
	}
}