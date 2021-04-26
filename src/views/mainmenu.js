import m from "mithril";

export default class MainMenuView {
    play() {
        m.route.set("/sp");
    }

    view() {
        return (
            <div class="main-center main-menu">
                <button onclick={() => this.play()}>Play!</button>
            </div>
        );
    }
}