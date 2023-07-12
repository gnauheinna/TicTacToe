export default class View {

    $ = {}
    $$ = {}


    constructor() {
        this.$.menu = this.#qs('[data-id="menu"]');
        this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
        this.$.menuItems = this.#qs('[data-id="menu-items"]');
        this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
        this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
        this.$.modal = this.#qs('[data-id="modal"]');
        this.$.modalText = this.#qs('[data-id="modal-text"]');
        this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
        this.$.turn = this.#qs('[data-id="turn"]');

        this.$$.squares = this.#qsAll('[data-id="square"]');


        //UI-only Event Listners
        // menu toggling
        this.$.menuBtn.addEventListener("click", (event) => {
            this.#toggleMenu();
        });
    }

    /*
     *   Register all the event listeners
     */

 
    bindGameResetEvent(handler) {
        this.$.resetBtn.addEventListener('click', handler);
    }

    bindNewRoundEvent(handler) {
        this.$.newRoundBtn.addEventListener('click', handler);
    }

    bindPlayerMoveEvent(handler) {
        this.$$.squares.forEach((square) => {
            square.addEventListener('click', handler);
        });
    }



    /*
     *  DOM helper methods
     */

    //menu toggling helper method
    #toggleMenu() {
        this.$.menuItems.classList.toggle("hidden");
        this.$.menuBtn.classList.toggle('border');

        const icon = this.$.menuBtn.querySelector('i');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
    }

    handlePlayerMove(squareEl, player) {
        const icon = document.createElement('i');
        icon.classList.add('fa-solid',
        player === 1 ? 'fa-x' : 'fa-o',
        player === 1 ? 'yellow' : 'turquoise')
        squareEl.replaceChildren(icon);
    }

    // player = 1 | 2
    setTurnIndicator(player){ 
        const icon = document.createElement('i')
        const label = document.createElement('p')

        // adds/ removes correct color for player
        this.$.turn.classList.add(player === 1 ? 'yellow' : 'turquoise')
        this.$.turn.classList.remove(player === 1 ? 'turquiose' : 'yellow')

        // adds correct icon for player

        icon.classList.add('fa-solid', player === 1? 'fa-x': 'fa-o')

        //label
        label.innerText = 
            player === 1? "Player 1, you're up!" : "Player 2, youre're up!"

        this.$.turn.replaceChildren(icon, label);
    }

    // private query selector + checker helper method 
    #qs(selector, parent) {
        const el = parent? parent.querySelector(selector): 
        document.querySelector(selector);
        if(!el) throw new Error("couldn't find selector");

        return el;
    }

    #qsAll(selector) {
        const ellist = document.querySelectorAll(selector);
        if(!ellist) throw new Error("couldn't find selector");

        return ellist;
    }
}