import Phaser from "phaser";
import MainScene from "@/scenes/main";

export default {
	type: Phaser.AUTO,
	width: 1280,
    height: 720,
	physics: {
		default: 'arcade'
	},
	scene: [MainScene]
}