import layers from "@/layers";

export default class Inventory {
	constructor(scene, {size}) {
		this.size = size;
		this.scene = scene;
		this.map = [
			{key: 'wood', amount: 0},
			{key: 'iron', amount: 0},
			{key: 'treasure', amount: 0},
			{key: 'oxygen', amount: this.size},
			{key: 'water', amount: 0}
		];

		this.flashFrames = 30;
		this.warnAmount = 0.4;
		this.warnCooldown = 3000;
		this.fastWarnAmount = 0.2;
		this.fastWarnCooldown = 1000;

		this.bar = this.scene.add.graphics(0, 0);
		this.bar.setScrollFactor(0);
		this.bar.depth = layers.UI_2;

		for(const item of this.map) {
			if(item.key === 'water') {
				item.obj = this.scene.add.sprite(0, 0);
				item.obj.play('water-bar')
				item.obj.setScrollFactor(0);
				item.obj.depth = layers.UI_1;
			}
			else {
				item.obj = this.scene.add.image(0, 0, `${item.key}-bar`);
				item.obj.setScrollFactor(0);
				item.obj.depth = layers.UI_1;
			}
			
		}

		this.flashStep = 0;
		this.warnStart = 0;
	}
	
	update(time, delta) {
		let sum = 50;
		this.bar.clear();

		this.bar.lineStyle(3, 0xffffff, 1)
		this.bar.strokeRect(-100, 50, 50, 800);

		for(const item of this.map) {
			const height = (item.amount/this.size) * 800;
			
			item.obj.setCrop(0, 0, 50, height);
			item.obj.setPosition(-75, sum + 800 / 2);
			item.sum = sum;

			sum += height;
		}

		if(this.get('oxygen')/this.size < this.fastWarnAmount) {
			if(!this.flash && this.warnStart === 0) {
				this.warnStart = time;
				this.flash = true;
			}
			else if((time-this.warnStart) > this.fastWarnCooldown) {
				this.warnStart = 0;
			}
		}
		else if(this.get('oxygen')/this.size < this.warnAmount) {
			console.log('test');
			if(!this.flash && this.warnStart === 0) {
				this.warnStart = time;
				this.flash = true;
			}
			else if((time-this.warnStart) > this.warnCooldown) {
				this.warnStart = 0;
			}
		}

		if(this.flash && this.flashStep < this.flashFrames) {
			this.flashStep++;
			const item = this.getItem('oxygen')
			const height = (item.amount/this.size) * 800;

			this.bar.fillStyle(0xff0000, 0.4)
			this.bar.fillRect(-100 +2, item.sum, 50-4, height);
		}
		else if(this.flash && this.flashStep === this.flashFrames) {
			this.flash = false;
			this.flashStep = 0;
		}
	}

	add(key, amount) {
		this.map.find(item => item.key === key).amount += amount;
		this.map.find(item => item.key === 'oxygen').amount -= amount;
	}

	remove(key, amount) {
		this.map.find(item => item.key === key).amount -= amount;
		this.map.find(item => item.key === 'oxygen').amount += amount;
	}

	sum() {
		return this.map.reduce((sum, next) => sum + next.amount, 0);
	}

	hasItems() {
		return this.map.find(item => item.amount > 0 && !['water', 'oxygen'].includes(item.key)) !== undefined;
	}

	get(key) {
		return this.map.find(item => item.key === key).amount;
	}

	getItem(key) {
		return this.map.find(item => item.key === key);
	}

	reset() {
		this.getItem('wood').amount = 0;
		this.getItem('water').amount = 0;
		this.getItem('iron').amount = 0;
		this.getItem('treasure').amount = 0;
		this.getItem('oxygen').amount = this.size;
	}
}