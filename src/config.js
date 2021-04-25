import Phaser from "phaser";
import MainScene from "@/scenes/main";

export default {
	type: Phaser.AUTO,
	width: 1280,
    height: 720,
	parent: 'game-frame',
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
            debugShowVelocity: true,
            debugVelocityColor: 0xffff00,
            debugBodyColor: 0x0000ff,
            debugStaticBodyColor: 0xffffff
		}
	},
	scene: [MainScene]
}