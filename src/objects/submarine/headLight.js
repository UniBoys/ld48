export default class HeadLight {
	constructor({scene, left, right, length = 1000, color = 0xffc357, strength = 0.5} = {}) {
		this.scene = scene;
		this.left = left;
		this.right = right;
		this.length = length;
		this.color = color;
		this.strength = strength;
	}

	flip(flipped) {
		this.flipped = flipped;
	}

	update(time, delta) {
		if(this.flipped) {
			this.scene.darkenMask.fillGradientStyle(this.color, 0x000000, 0x000000, this.color, this.strength, 0, 0, 0, this.strength/2);
			const x = this.right.relativeX + this.scene.submarine.obj.body.x;
			const y = this.right.relativeY + this.scene.submarine.obj.body.y;
			
			this.scene.darkenMask.fillTriangle(
				x, y,
				Math.cos(this.right.a1 * Phaser.Math.DEG_TO_RAD) * this.length + x, Math.sin(this.right.a1 * Phaser.Math.DEG_TO_RAD) * this.length + y,
				Math.cos(this.right.a2 * Phaser.Math.DEG_TO_RAD) * this.length + x, Math.sin(this.right.a2 * Phaser.Math.DEG_TO_RAD) * this.length + y,
			)
		}
		else {
			this.scene.darkenMask.fillGradientStyle(this.color, 0x000000, 0x000000, this.color, this.strength, 0, 0, 0, this.strength/2);
			const x = this.left.relativeX + this.scene.submarine.obj.body.x;
			const y = this.left.relativeY + this.scene.submarine.obj.body.y;
			
			this.scene.darkenMask.fillTriangle(
				x, y,
				Math.cos(this.left.a1 * Phaser.Math.DEG_TO_RAD) * this.length + x, Math.sin(this.left.a1 * Phaser.Math.DEG_TO_RAD) * this.length + y,
				Math.cos(this.left.a2 * Phaser.Math.DEG_TO_RAD) * this.length + x, Math.sin(this.left.a2 * Phaser.Math.DEG_TO_RAD) * this.length + y,
			)
		}
	}
}