export default class Weapon {
	constructor({scene, submarine, relativeX, relativeY, moveRelative, width, height}) {
		this.scene = scene;
		this.relativeX = relativeX;
		this.relativeY = relativeY;
		this.moveRelative = moveRelative;
		this.width = width;
		this.height = height;
		this.submarine = submarine;
	}

	update(delta) {
		if(this.moveRelative) {
			this.obj.body.x = this.scene.submarine.obj.body.x;
			this.obj.body.y = this.scene.submarine.obj.body.y;
			this.obj.body.x += this.relativeX;
			this.obj.body.y += this.relativeY;
		}
	}
}