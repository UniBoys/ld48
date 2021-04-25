
/**
 * @callback creatorCallback
 * @param  {number} x
 * @param  {number} y
 * @returns {Spawnable}
 */

export class Spawner {
	/**
	 * @param {Phaser.Scene} scene 
     * @param {{x: number, y: number, must: boolean}[]} spawns
     * @param {number} limit
     * @param {creatorCallback} creator
	 */
    constructor(scene, spawns, limit, creator) {
        this.scene = scene;
        this.spawns = spawns;
        this.limit = limit;
        this.creator = creator;

        this.spawned = new Array(Spawnable)

        init()
    }

    init() {
        this.spawns
            .filter((spawn) => spawn.must)
            .forEach((spawn) => this.spawned.push(creator(spawn.x, spawn.y)));
        const left = this.spawns
            .filter((spawn) => !spawn.must)
            .limit(this.limit-this.spawned.length);
        shuffleArray(left)
        left.forEach((spawn) => this.spawned.push(creator(spawn.x, spawn.y)))
    }

    update(time, delta) {
        
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export class Spawnable {
    dispose()
}