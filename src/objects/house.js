import layers from "@/layers";
import HouseInventory from "@/objects/houseInventory";

export default class House {
    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene) {
        this.scene = scene;
        this.initX = 2500;
        this.initY = 490;
        this.radius = 400;
        this.inventory = new HouseInventory({scene, size: 1000, house: this});
        this.upgrades = [250 - 1, 600 - 1, 350 - 1];

        this.obj = this.scene.add.image(this.initX, this.initY, 'house');
        this.scene.physics.add.existing(this.obj);
        this.obj.setScale(0.25);
        this.obj.body.setVelocityY(-7);

        this.obj.depth = layers.CONNECTORS;

        this.width = this.obj.body.width * this.obj.scaleX;
        this.height = this.obj.body.height * this.obj.scaleY;

        this.inventory.init();
    }

    update(time, delta) {
        const y = this.obj.body.y;

        if (y > 310) {
            this.obj.body.setAccelerationY(-10 + Math.random() * 10);
        } else if (y < 295) {
            this.obj.body.setAccelerationY(10 + Math.random() * -10);
        } else {
            this.obj.body.setAccelerationY(0);
        }

        const submarineCenter = this.scene.submarine.obj.body.center;
        const dist = Phaser.Math.Distance.BetweenPoints(submarineCenter, this.obj.body.center);

        if (dist < this.radius) {
            this.inventory.visible = true;

            if (this.scene.keylistener.E.isUp) {
                this.waitTillUp = false;
            }

            if (this.scene.keylistener.E.isDown) {
                if (this.scene.submarine.inventory.hasItems()) {
                    this.inventory.add('wood', this.scene.submarine.inventory.get('wood'));
                    this.inventory.add('iron', this.scene.submarine.inventory.get('iron'));
                    this.inventory.add('treasure', this.scene.submarine.inventory.get('treasure'));
                    this.scene.submarine.inventory.reset();
                    this.waitTillUp = true;
                } else if (this.canUpgrade() && !this.waitTillUp) {
                    this.removeItems();

                    this.scene.stageIndex++;
                    this.scene.submarine.destroy();
                    this.scene.submarine = new (this.scene.stageList[this.scene.stageIndex % this.scene.stageList.length])(this.scene);
                    this.scene.smallSub.setTexture(`sub${this.scene.stageIndex+1}`, 0);
                    this.scene.updateColliding();

                    const sound = this.scene.sound.add('upgrade');
                    sound.setVolume(1);
                    sound.play();
                }
            }
        } else {
            this.inventory.visible = false;
        }

        this.inventory.update(time, delta);
    }

    removeItems() {
        if (this.scene.submarine.stage === 1) {
            this.inventory.remove('wood', this.upgrades[0]);
        } else if (this.scene.submarine.stage === 2) {
            this.inventory.remove('iron', this.upgrades[1]);
        } else if (this.scene.submarine.stage === 3) {
            this.inventory.remove('treasure', this.upgrades[2]);
        }
    }

    canUpgrade() {
        if (this.scene.submarine.stage === 1) {
            return this.inventory.get('wood') >= this.upgrades[0];
        } else if (this.scene.submarine.stage === 2) {
            return this.inventory.get('iron') >= this.upgrades[1];
        } else if (this.scene.submarine.stage === 3) {
            return this.inventory.get('treasure') >= this.upgrades[2];
        } else {
            return false;
        }
    }
}