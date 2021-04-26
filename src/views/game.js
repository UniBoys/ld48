import m from "mithril";
import config from "@/config";
import Phaser from "phaser";

export default class GameView {
    oncreate() {
        this.game = new Phaser.Game(config);

        document.addEventListener('keydown', e => {
            if(e.key === 'Escape') this.togglePause();
        })

        this.paused = false;
    }

    togglePause() {
        document.getElementById('container').classList.toggle('paused');

        if(this.paused) {
            this.game.scene.resume('main');
            this.paused = false;
        }
        else {
            this.game.scene.pause('main');
            this.paused = true;
        }
    }

    view() {
        return (
            <div id='container' class='container'>
                <div id="game-frame" class="main-center">
				
                </div>
                <div class='escape-menu'>

                </div>
            </div>
        );
    }
}