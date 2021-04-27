import layers from "../../layers";
import Enemy from "../enemy";

export default class Queen extends Enemy {
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

        this.x = x;
        this.y = y;

        this.wiggle = {
            multiplier: 0.2,
            delay: 20,
            last: 0,
        }

        this.obj = scene.add.sprite(x, y);
        this.obj.setScale(0.28)
        this.obj.play("prison-idle")
        this.obj.depth = layers.QUEEN_BEFORE;
        this.obj.setOrigin(0.5, 1)

        this.queen = scene.add.sprite(x + 80, y);
        this.queen.setScale(0.6)
        this.queen.play("queen-idle")
        this.queen.depth = layers.QUEEN;
        this.queen.setOrigin(0.5, 1)

        this.init()

        this.obj.body.setSize(this.obj.width * .85, this.obj.height * .6);
        this.obj.body.setOffset(3, 600)

        this.bg = this.scene.add.image(x + 10, y, 'queen-prison-bg');
        this.bg.setOrigin(0.5, 1)
        this.bg.setDisplaySize(2260 / 7, 1584 / 7);
        this.bg.depth = layers.QUEEN_BEHIND;

        this.radial = this.scene.add.image(x - 230, y - 60, 'glow');
        this.radial.setAlpha(0.4);
        this.radial.setOrigin(0.5, 1)
        this.radial.setTint(0x651fff);
        this.radial.setDisplaySize(90, 90);
        this.radial.depth = layers.LANTERN;
    }

    dispose() {
        if (this.disposed) return
        this.disposed = true
        this.obj.play("prison-break")
        const startY = this.queen.y
        this.scene.tweens.addCounter({
            from: 0,
            to: 400,
            ease: 'Sine.easeIn',
            duration: 5000,
            onUpdate: (tween) => {
                this.queen.y = startY - tween.getValue()
            },
            onComplete: () => {
                const backScreen = this.scene.add.rectangle(0, 0, 0, 0, 0x000000);
		        backScreen.setScrollFactor(0)
		        backScreen.setDisplaySize(1600/.8, 900/.8);
		        backScreen.setPosition(800, 450);
		        backScreen.depth = layers.UI_SCREEN_BACK;

                const endScreen = this.scene.add.image(0, 0, 'end-screen');
		        endScreen.setScrollFactor(0)
		        endScreen.setDisplaySize(900/.8, 900/.8);
		        endScreen.setPosition(800, 450);
		        endScreen.depth = layers.UI_SCREENS;

                const endText = this.scene.add.text(700, 670, `${Math.round(this.time/1000)} seconds`, {fontFamily: 'Amatic SC', fontSize: 60});
		        endText.setScrollFactor(0);
		        endText.depth = layers.UI_SCREENS_TEXT;

                this.scene.game.scene.pause(this.scene);
            }
        })

        this.scene.tweens.add({
            targets: [this.queen, this.radial],
            alpha: 0.0,
            ease: 'Sine.easeIn',
            duration: 4000,
            delay: 1000
        })
    }

    damage(amount) {
        if (!this.scene.enemies.some((enemy) => {
            if (enemy !== this && enemy.obj.x > 1000 && enemy.obj.x < 4500 && enemy.obj.y > 4600) console.log('Found: ', enemy)
            return enemy !== this && enemy.obj.x > 1000 && enemy.obj.x < 4500 && enemy.obj.y > 4600
        })) {
            console.log(`Can damage!`)
            super.damage(amount)
        }
    }

    update(time, delta) {
        super.update(time, delta);
        this.obj.setPosition(this.x, this.y)
        this.time = time;
    }
}