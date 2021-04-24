import m from "mithril";
import config from "@/config";
import Phaser from "phaser";

export default class GameView {
    oninit() {
        this.game = new Phaser.Game(config);
    }

    view() {
        
    }
}