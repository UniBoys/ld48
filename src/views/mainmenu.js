import m from "mithril";

import StartScreen from "@/../resources/img/start-screen.png";
import StartButton from "@/../resources/img/start-btn.png";
import StartButtonHover from "@/../resources/img/start-btn-hover.png";
import StartButtonDown from "@/../resources/img/start-btn-down.png";

export default class MainMenuView {

    play() {
        m.route.set("/sp");
    }

    onHover(hovering) {
        const img = document.getElementById("start")
        if (hovering) img.src = StartButtonHover
        else img.src = StartButton
    }

    onDown(down) {
        const img = document.getElementById("start")
        if (down) img.src = StartButtonDown
        else img.src = StartButton
    }

    view() {
        return (
            <div class="main-center main-menu" style={{backgroundImage: `url(${StartScreen})`}}>
                <img id="start" class="btn start" src={StartButton} onclick={() => this.play()}
                     onmouseenter={() => this.onHover(true)}
                     onmouseleave={() => this.onHover(false)}
                     onmousedown={() => this.onDown(true)}
                     onmouseup={() => this.onDown(false)}>
                </img>
            </div>
        );
    }
}