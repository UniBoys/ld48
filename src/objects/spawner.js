
/**
 * @callback disposingCallback
 * @param {Spawner} spawnable
 */

/**
 * @callback creatorCallback
 * @param {number} x
 * @param {number} y
 * @param {disposingCallback} disposing
 * @returns {Spawnable}
 */

export class Spawner {
	/**
	 * @param {Phaser.Scene} scene 
     * @param {{x: number, y: number, must: boolean}[]} spawns
     * @param {number} limit
     * @param {Spawnable[]} array
     * @param {creatorCallback} creator
	 */
    constructor(scene, spawns, limit, delay, array, creator) {
        this.scene = scene;
        this.spawns = spawns;
        this.limit = limit;
        this.array = array;
        this.creator = creator;

        this.lastCheck = 0;
        this.delay = delay;
        this.spawned = new Array(Spawnable);

        this.init()
    }

    init() {
        this.spawns
            .filter((spawn) => spawn.must)
            .forEach((spawn) => this.add(spawn.x, spawn.y));
        const left = this.spawns
            .filter((spawn) => !spawn.must);

        shuffleArray(left)

        left
            .slice(0, this.limit-this.spawned.length+1)
            .forEach((spawn) => this.add(spawn.x, spawn.y));
    }

    add(x, y) {
        const spawnable = this.creator(x, y, (s) => this.removeSpawnable(s))

        this.spawned.push(spawnable)
        this.array.push(spawnable)
    }

    removeSpawnable(spawnable) {
        const index = this.spawned.indexOf(spawnable);
        if (index > -1) {
            this.spawned.splice(index, 1);
        }
    }

    update(time, delta) {
        if(time - this.lastCheck > this.delay) {
            this.lastCheck = time;
            if(this.limit>this.spawned.length) {
                const left = this.spawns
                    .filter((spawn) => !this.spawned.some((s) => (s?.x ?? s?.obj?.x) == spawn.x && (s?.y || s?.obj?.y) == spawn.y));

                shuffleArray(left)

                left
                    .slice(0, this.limit-this.spawned.length+1)
                    .forEach((spawn) => this.add(spawn.x, spawn.y))
            }
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export class Spawnable {

    /**
     * @param {disposingCallback} disposing 
     */
    constructor(disposing) {
        this.disposing = disposing
    }

    update(time, delta) {}
    dispose() {
        this.disposing(this)
    }
}