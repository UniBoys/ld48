import {Scene, Input, Camera} from "phaser";
import Player from "@/objects/player";
import Squid from "@/objects/enemies/squid"
import SubmarineStage1 from "../objects/submarine/stage1";

export default class MainScene extends Scene {
	constructor() {
		super({key: 'main'});
	}

    create() {
        this.cameras.main.setBackgroundColor("#4488AA")

        for(var i = 0; i < 10; i++) {
            this.add.rectangle(200 + i*10, 200 + 200*i, 50, 50, 0x00ff00);
		}

		this.submarine = new SubmarineStage1(this)
		this.player = new Player(this)
        
		this.physics.world.setBounds(0, 0, 2000, 2000);
        this.cameras.main.setBounds(0, 0, 2000, 2000);

		this.enemies = []

		this.enemies.push(new Squid(this, 300, 200))

		this.keylistener = this.input.keyboard.addKeys("W,A,S,D,SPACE");
    }

	update(time, delta) {
		this.submarine.update(time, delta);
		this.player.update(delta);
		this.enemies.forEach(enemy => { enemy.update(time, delta) })
	}
}