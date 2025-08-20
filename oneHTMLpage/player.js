//player is reprisented via a static class
class Player {
    static x = null
    static y = null
    static inventory = []
    static hp = 3
    static atk = 1
    static def = 0

    //main game control function
    static handleInput(key) {
        let movX = 0
        let movY = 0
        switch (key) {
            case "w":
                movY = -1
                break;
            case "a":
                movX = -1
                break;
            case "s":
                movY = 1
                break;
            case "d":
                movX = 1
                break;
            case "r":
                break;
        }
        if (Dungeon.mapGet(this.x + movX, this.y + movY) === floor) {
            Dungeon.mapSet(this.x, this.y, floor)
            this.x += movX
            this.y += movY
            Dungeon.mapSet(this.x, this.y, this)
        } else {
            this.interact({ x: this.x + movX, y: this.y + movY})
        }

        Dungeon.enemies.forEach(enemy => {
            enemy.movement()
        });

        Dungeon.toHypertext()

        if (this.hp <= 0) {
            document.getElementById("HUD").style.display = "none"
            document.getElementById("display").innerHTML = "<div class='visible'>GAME OVER<br><br> press <a href=''>[HERE]</a> to play again<div>"
        }
    }

    static interact(i) {
        if (Dungeon.mapGet(i.x, i.y) instanceof Chest) {
            Dungeon.mapGet(i.x, i.y).open()
        }
        if (Dungeon.mapGet(i.x, i.y) === portal) {
            Dungeon.generate()
        }
        if (Dungeon.mapGet(i.x, i.y) instanceof Monster) {
            Dungeon.mapGet(i.x, i.y).damage()
        }
    }

    static updateHealth() {
        let health = ""
        for (let i = 0; i < this.hp; i++) {
            health += heart
        }
        document.getElementById("hp").innerHTML = health
    }

    static toString() {
        return "<span class='visible'>i</span>"
    }
}