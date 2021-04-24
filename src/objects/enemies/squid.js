import Enemy from '@/objects/enemy'

export default class Squid extends Enemy {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
    constructor(scene, x, y) {
        super(scene)

        this.attackDistance = 1000
        this.speed = 20

        this.obj = scene.add.rectangle(x, y, 80, 80, 0xff00ff);
        this.init()
    }


    update(time, delta) {
        const submarine = this.scene.submarine

        console.log(`${submarine.obj.x} - ${this.obj.x} (${submarine.obj.x - this.obj.x}) > ${-this.attackDistance} ${submarine.obj.x - this.obj.x > -this.attackDistance}`)
        if(submarine.obj.x - this.obj.x < this.attackDistance) {
            this.obj.body.setVelocityX(-this.speed)
        } else if(submarine.obj.x - this.obj.x > -this.attackDistance) {
            this.obj.body.setVelocityX(this.speed)
        } else {
            this.obj.body.setVelocityX(0)
        }
    }
}