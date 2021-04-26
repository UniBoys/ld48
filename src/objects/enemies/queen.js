import layers from "../../layers";
import Enemy from "../enemy";

export default class Queen extends Enemy{
	/**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
	 constructor(scene, x, y, disposable) {
        super(scene, disposable, 4)

        this.attackDistance = 0
		this.acceleration = 0;
		this.deceleration = 0;
        this.maxSpeed = 0;
        this.changeBonus = 0;

        this.wiggle = {
            multiplier: 0.2,
            delay: 20,
            last: 0,
        }

        this.obj = scene.add.sprite(x, y);
		this.obj.setScale(0.28)
		this.obj.play("prison-idle")
        this.obj.depth = layers.MOBS;
		this.obj.setOrigin(0.5, 1)

        this.init()

		this.obj.body.setSize(this.obj.width*.85, this.obj.height*.6);
		this.obj.body.setOffset(3, 600)

		this.radial = this.scene.add.image(x, y, 'queen-prison-bg');
		this.obj.setOrigin(0.5, 1)
		this.radial.setAlpha(0.5);
		this.radial.setTint(0x651fff);
		this.radial.setDisplaySize(2260/7, 1584/7);
		this.radial.depth = layers.LANTERN;
    }

    dispose() {
        super.dispose()
        this.obj.destroy()
        this.radial.destroy();
    }

    update(time, delta) {
        super.update(time, delta);
    }
}