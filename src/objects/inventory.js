export default class Inventory {
	constructor({size}) {
		this.size = size;
		this.map = [
			{key: 'wood', amount: 0},
			{key: 'iron', amount: 0},
			{key: 'ingots', amount: 0},
			{key: 'water', amount: 0},
			{key: 'oxygen', amount: 0}
		];
	}
	
	update(time, delta) {

	}

	add(key, amount) {
		const sum = this.sum();

		if(sum + amount > this.size) {
			amount = this.size - this.sum();
		}

		console.log(key, amount, this.map.find(item => item.key === key));

		this.map.find(item => item.key === key).amount += amount;
		this.map.find(item => item.key === 'oxygen').amount -= amount;
	}

	remove(key, amount) {
		this.map.find(item => item.key === key).amount -= amount;
		this.map.find(item => item.key === 'oxygen').amount += amount;
	}

	sum() {
		return this.map.reduce((sum, next) => sum + next.value, 0);
	}

	hasItems() {
		return this.map.find(item => item.value > 0 && ['water', 'oxygen'].includes(item.key)) !== undefined;
	}

	get(key) {
		return this.map.find(item => item.key === key).amount;
	}
}