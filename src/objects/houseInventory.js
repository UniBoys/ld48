export default class HouseInventory {
    constructor({scene, size, house} = {}) {
        this.scene = scene;
        this.size = size;
        this.house = house;
        this.map = [
            {key: 'wood', amount: 0, color: 0x964B00},
            {key: 'iron', amount: 0, color: 0x8B2A2B},
            {key: 'treasure', amount: 0, color: 0xFFD700}
        ];
        this.barWidth = 400;
        this.barHeight = 30;

        this.visible = false
    }

    init() {
        this.bar = this.scene.add.graphics();

        for (const item of this.map) {
            item.obj = this.scene.add.image(0, 0, `${item.key}-bar`);
            item.obj.setAngle(-90);
            item.obj.setOrigin(0, 0)
        }

		this.text = this.scene.add.text(this.house.obj.body.x + 50, this.house.obj.body.y - 130, 'Stash to see your upgrades', {fontFamily: 'Amatic SC', fontSize: 50});
		this.text.setAlign('center');
	}
	
	update(time, delta) {
		let order = ['wood', 'iron', 'treasure'];
		let line;
		let hide = [];

		if(this.scene.submarine.inventory.hasItems()) {
			this.text.setText('Press e to stash');
		}
		else if(this.scene.submarine.stage === 1) {
			if(this.get('wood') >= this.house.upgrades[0]) {
				this.text.setText('Press e to upgrade');
			}
			else {
				this.text.setText('Try to find more wood');
			}

			line = this.house.upgrades[0]/this.size;
		}
		else if(this.scene.submarine.stage === 2) {
			if(this.get('wood') >= this.house.upgrades[1]) {
				this.text.setText('Press e to upgrade');
			}
			else {
				this.text.setText('Try to find more iron');
			}

			order = ['iron', 'treasure'];
			hide = ['wood'];
			line = this.house.upgrades[1]/this.size;
		}
		else if(this.scene.submarine.stage === 3) {
			if(this.get('wood') >= this.house.upgrades[2]) {
				this.text.setText('Press e to upgrade');
			}
			else {
				this.text.setText('Try to find more treasures');
			}

			order = ['treasure'];
			hide = ['wood', 'iron'];
			line = this.house.upgrades[2]/this.size;
		}
		else if(this.scene.submarine.stage === 4) {
            this.text.setText('Go find the queen');
        }

        const x = this.house.obj.body.x + 50;
        const y = this.house.obj.body.y - 70;

        this.bar.clear();

        this.bar.lineStyle(2, 0xffffff, 1)
        this.bar.strokeRect(x, y, this.barWidth, this.barHeight);

        if (line) {
            this.bar.lineStyle(4, this.getObj(order[0]).color, 1)
            this.bar.lineBetween(x + this.barWidth * line, y - 2, x + this.barWidth * line, y + this.barHeight + 2)
        }

		let sum = 0;

		for(const item of order) {
			const obj = this.getObj(item);
			obj.obj.setPosition(x + (sum / this.size) * this.barWidth, y + this.barHeight)
			obj.obj.setCrop(0, 0, this.barHeight, (obj.amount / this.size) * this.barWidth);

			sum += obj.amount;
		}

		for(const item of hide) {
			const obj = this.getObj(item);
			obj.obj.setPosition(-1000, -1000)
		}

		this.text.x = this.house.obj.body.x + this.house.obj.body.width/2 - this.text.width/2;
		this.text.y = this.house.obj.body.y - 130;

		if(this.visible) {
			this.text.visible = true;
			this.bar.visible = true;

			for(const item of this.map) {
				item.obj.visible = true;
			}
		}
		else {
			this.text.visible = false;
			this.bar.visible = false;

			for(const item of this.map) {
				item.obj.visible = false;
			}			
		}
    }

    add(key, amount) {
        const sum = this.sum();

        if (sum + amount > this.size) {
            amount = this.size - this.sum();
        }

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

    getObj(key) {
        return this.map.find(item => item.key === key);
    }
}