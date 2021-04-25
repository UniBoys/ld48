export default class HouseInventory {
	constructor({scene, size, house} = {}) {
		this.scene = scene;
		this.size = size;
		this.house = house;
		this.map = [
			{key: 'wood', amount: 0},
			{key: 'iron', amount: 0},
			{key: 'ingots', amount: 0}
		];
		this.barWidth = 400;
		this.barHeight = 30;

		this.visible = false
	}

	init() {
		this.bar = this.scene.add.graphics();
		this.text = this.scene.add.text(this.house.obj.body.x + 50, this.house.obj.body.y - 130, 'Stash to see your upgrades', {fontFamily: 'Amatic SC', fontSize: 50});
		this.text.setAlign('center');
	}
	
	update(time, delta) {
		const x = this.house.obj.body.x + 50;
		const y = this.house.obj.body.y - 70;
		let order = ['wood', 'iron', 'ingots'];
		let line;

		this.bar.clear();

		this.bar.lineStyle(2, 0xffffff, 1)
		this.bar.strokeRect(x, y, this.barWidth, this.barHeight);

		if(this.scene.submarine.inventory.hasItems()) {
			this.text.setText('Stash to see your upgrades');
		}
		else if(this.scene.submarine.stage === 1) {
			if(this.get('wood') > this.house.upgrades[0]) {
				this.text.setText('You can upgrade now');
			}
			else {
				this.text.setText('Try to find more wood');
			}

			line = this.house.upgrades[0]/this.size;
		}
		else if(this.scene.submarine.stage === 2) {
			if(this.get('wood') > this.house.upgrades[1]) {
				this.text.setText('You can upgrade now');
			}
			else {
				this.text.setText('Try to find more iron');
			}

			order = ['iron', 'wood', 'ingots'];
			line = this.house.upgrades[1]/this.size;
		}
		else if(this.scene.submarine.stage === 3) {
			if(this.get('wood') > this.house.upgrades[2]) {
				this.text.setText('You can upgrade now');
			}
			else {
				this.text.setText('Try to find more treasures');
			}

			order = ['ingots', 'iron', 'wood'];
			line = this.house.upgrades[2]/this.size;
		}
		else if(this.scene.submarine.stage === 4) {
			this.text.setText('There are no upgrades left');
		}

		if(line) {

		}

		this.text.x = this.house.obj.body.x + this.house.obj.body.width/2 - this.text.width/2;
		this.text.y = this.house.obj.body.y - 130;

		if(this.visible) {
			this.text.visible = true;
			this.bar.visible = true;
		}
		else {
			this.text.visible = false;
			this.bar.visible = false;
		}
	}

	add(key, amount) {
		const sum = this.sum();

		if(sum + amount > this.size) {
			amount = this.size - this.sum();
		}

		console.log(key, amount, this.map.find(item => item.key === key));

		this.map.find(item => item.key === key).amount += amount;
	}

	remove(key, amount) {
		this.map.find(item => item.key === key).amount -= amount;
	}

	sum() {
		return this.map.reduce((sum, next) => sum + next.value, 0);
	}

	get(key) {
		return this.map.find(item => item.key === key).amount;
	}
}