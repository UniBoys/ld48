import layers from "./layers";

export default class RadialManager {
	constructor(scene, number) {
		this.scene = scene;
		this.number = number;
		this.list = [];
	}
	
	create() {
		for(let i = 0; i < this.number; i++) {
			const radial = this.scene.add.image(-1000, -1000, 'glow');
			radial.depth = layers.DARKEN;
			radial.free = true;

			if(i === 0) {
				this.scene.darkenMask.mask = new Phaser.Display.Masks.BitmapMask(this.scene, radial);
				this.scene.darkenMask.invertAlpha = true;

				const emptyGraphics = this.scene.add.graphics();
				emptyGraphics.fillStyle(0x000000, 0.0);
				emptyGraphics.fillRect(0, 606, 5000, 5400);

				radial.mask = new Phaser.Display.Masks.GeometryMask(this.scene, emptyGraphics);
				radial.invertAlpha = true;
				radial.emptyGraphics = emptyGraphics;
			} 
			else if(i == 1) {
				this.list[0].emptyGraphics.mask = new Phaser.Display.Masks.BitmapMask(this.scene, radial);
				this.list[0].emptyGraphics.invertAlpha = true;
			}
			else {
				this.list[i-1].mask = new Phaser.Display.Masks.BitmapMask(this.scene, radial);
				this.list[i-1].invertAlpha = true;
			}
			
			this.list[i] = radial;
		}
	}

	getFree(obj) {
		this.update();
		
		const radial = this.list.find(radial => radial.free);
		radial.obj = obj;
		radial.free = false;

		return radial;
	}

	update() {
		for(const radial of this.list) {
			if(radial.obj && radial.obj.active === true) continue;

			radial.obj = undefined;
			radial.free = true;
		}
	}
}