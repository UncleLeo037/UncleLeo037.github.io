const monsEnum = {
    slime: "<span class='visible'>~</span>",
    ghost: "<span class='visible'>;</span>",
    bug: "<span class='visible'>*</span>",
    dullahan: "<span class='visible'>l</span>",
    snake: "<span class='visible'>s</span>",
    lamia: "<span class='visible'>j</span>",
    armor: "<span class='visible'>1</span>",
    skull: "<span class='visible'>.</span>"
}

class Monster {

    constructor(h, x, y, b, a, d, m, r) {
        this.id = Dungeon.enemies.length
        this.health = 2
        this.x = x
        this.y = y
        this.breed = b
        this.atk = a
        this.def = d
        this.mgk = m
        this.res = r
        this.awr = 5
    }

    movement() {
        if (Dungeon.mapGet(this.x + 1, this.y) === Player ||
            Dungeon.mapGet(this.x - 1, this.y) === Player ||
            Dungeon.mapGet(this.x, this.y + 1) === Player ||
            Dungeon.mapGet(this.x, this.y - 1) === Player) {
            Player.hp -= this.atk
            Player.updateHealth()
            return
        }

        let diffX = Player.x - this.x
        let diffY = Player.y - this.y

        if (this.distToPlayer() < this.awr) {
            Dungeon.mapSet(this.x, this.y, floor)
            if (Dungeon.mapGet(this.x + this.normalise(diffX), this.y) === floor && Math.abs(diffX) >= Math.abs(diffY)) {
                this.x += this.normalise(diffX)
            } else if (Dungeon.mapGet(this.x, this.y + this.normalise(diffY)) === floor) {
                this.y += this.normalise(diffY)
            }
            Dungeon.mapSet(this.x, this.y, this)
        }
    }


    normalise(num) {
        if (num < 0) {
            return -1
        } else if (num > 0) {
            return 1
        } else {
            return 0
        }
    }


    damage() {
        this.health = this.health - Player.atk
        if (this.health < 1) {
            Dungeon.mapSet(this.x, this.y, floor)
            Dungeon.enemies[this.id] = Dungeon.enemies[Dungeon.enemies.length - 1]
            Dungeon.enemies[this.id].id = this.id
            Dungeon.enemies.pop()
        }
    }


    distToPlayer() {
        return getDist({x: this.x, y: this.y}, {x: Player.x, y: Player.y})
    }


    toString() {
        return this.breed
    }
}