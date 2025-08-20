class Chest {
    #isOpen
    constructor() {
        this.#isOpen = false;
    }
    open() {
        this.#isOpen = true;
        //code to give player loot
    }
    toString() {
        if (this.#isOpen) {
            return "<span class='visible'>H</span>"
        }
        return "<span class='visible'>A</span>"
    }
}