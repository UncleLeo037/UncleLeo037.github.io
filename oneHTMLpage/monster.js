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

    constructor(x, y, c) {
        this.id = Dungeon.enemies.length;
        this.x = x;
        this.y = y;
        this.c = c;
        this.health = 1;
        this.atk = 1;
        this.def = 0;
        this.mgk = 0;
        this.res = 0;
    }

    oldMovement() {
        if (this.attack()) {
            return;
        }

        let diffX = Player.x - this.x;
        let diffY = Player.y - this.y;

        if (this.distToPlayer() < this.awr) {
            Dungeon.mapSet(this.x, this.y, floor);
            if (Dungeon.mapGet(this.x + this.normalise(diffX), this.y) === floor && Math.abs(diffX) >= Math.abs(diffY)) {
                this.x += this.normalise(diffX);
            } else if (Dungeon.mapGet(this.x, this.y + this.normalise(diffY)) === floor) {
                this.y += this.normalise(diffY);
            }
            Dungeon.mapSet(this.x, this.y, this);
        }
    }


    attack() {
        if (Dungeon.mapGet(this.x + 1, this.y) === Player ||
            Dungeon.mapGet(this.x - 1, this.y) === Player ||
            Dungeon.mapGet(this.x, this.y + 1) === Player ||
            Dungeon.mapGet(this.x, this.y - 1) === Player) {
            Player.hp -= this.atk;
            Player.updateHealth();
            return true;
        }
        return false;
    }


    normalise(num) {
        if (num < 0) {
            return -1;
        } else if (num > 0) {
            return 1;
        } else {
            return 0;
        }
    }


    damage() {
        this.health -= Player.atk;
        if (this.health <= 0) {
            Dungeon.mapSet(this.x, this.y, floor);
            Dungeon.enemies[this.id] = Dungeon.enemies[Dungeon.enemies.length - 1];
            Dungeon.enemies[this.id].id = this.id;
            Dungeon.enemies.pop();
        }
    }


    distToPlayer() {
        return getDist({ x: this.x, y: this.y }, { x: Player.x, y: Player.y });
    }


    toString() {
        return `<span class='visible'>${this.c}</span>`;
    }
}

class Slime extends Monster {

    constructor(x, y) {
        super(x, y, "~");
    }

    movement() {
        //first call attack and don't fo anything else if attacked
        if (!this.attack()) {
            let movX = Math.round(Math.random(2) - 1)
            let movY = Math.round(Math.random(2) - 1)

            if (Dungeon.mapGet(this.x + movX, this.y + movY) === floor) {
                Dungeon.mapSet(this.x, this.y, floor)
                this.x += movX
                this.y += movY
                Dungeon.mapSet(this.x, this.y, this)
            }

            if (Dungeon.mapGet(this.x + movY, this.y + movX) === floor && Math.random() < 0.3) {
                let temp = Object.create(this)
                temp.id = Dungeon.enemies.length
                temp.x += movY
                temp.y += movX
                Dungeon.enemies.push(temp)
                Dungeon.mapSet(temp.x, temp.y, temp)
            }
        }
    }
}

class Ghost extends Monster {

    constructor(x, y) {
        super(x, y, ";");
        this.tile = floor
    }

    movement() {
        if (!this.attack()) {
            let diffX = Player.x - this.x;
            let diffY = Player.y - this.y;

            Dungeon.mapSet(this.x, this.y, this.tile);

            if (Math.abs(diffX) >= Math.abs(diffY)) {
                this.x += this.normalise(diffX);
            } else {
                this.y += this.normalise(diffY);
            }
            this.tile = Dungeon.mapGet(this.x, this.y)
            Dungeon.mapSet(this.x, this.y, this);
        }
    }
}

class Headless extends Monster {

    constructor(x, y) {
        super(x, y, "l");
        this.dir = {
            x: 0,
            y: 0
        }
    }

    movement() {
        if (this.attack()) {
            this.dir.x = this.normalise(Player.x - this.x)
            this.dir.y = this.normalise(Player.y - this.y)
        } else {
            if (Dungeon.mapGet(this.x + this.dir.x, this.y + this.dir.y) === floor && (this.dir.x !== 0 || this.dir.y !== 0)) {
                Dungeon.mapSet(this.x, this.y, floor);
                this.x += this.dir.x;
                this.y += this.dir.y;
                Dungeon.mapSet(this.x, this.y, this);
            } else {
                let dirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
                dirs.sort(() => .5 - Math.random());
                dirs.forEach(opt => {
                    if (Dungeon.mapGet(this.x + opt.x, this.y + opt.y) === floor) {
                        this.dir.x = opt.x;
                        this.dir.y = opt.y;
                        this.movement();
                        return;
                    }
                })
            }
        }
    }
}

class Gorgon extends Monster {

    constructor(x, y) {
        super(x, y, "j");
        this.awr = 5;
        this.moved = false;
    }

    movement() {
        if (getDist({ x: this.x, y: this.y }, { x: Player.x, y: Player.y }) < this.awr) {
            if (this.moved) {
                this.moved = false;
            } else {
                this.moved = true;
                if (this.attack()) {
                    document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'r' }));
                } else {
                    let diffX = Player.x - this.x;
                    let diffY = Player.y - this.y;
                    let normX = this.normalise(diffX)
                    let normY = this.normalise(diffY)
                    let movX = false;
                    let movY = false;
                    Dungeon.mapSet(this.x, this.y, floor);
                    if (Dungeon.mapGet(this.x + normX, this.y) === floor && Math.abs(diffX) > 0) {
                        this.x += normX;
                        movX = true;
                    }
                    if (Dungeon.mapGet(this.x, this.y + normY) === floor && Math.abs(diffY) > 0) {
                        this.y += normY;
                        movY = true;
                    }
                    if (Dungeon.mapGet(this.x + normX, this.y) === floor && Math.abs(diffX) > 2 && !movY) {
                        this.x += normX;
                    }
                    if (Dungeon.mapGet(this.x, this.y + normY) === floor && Math.abs(diffY) > 2 && !movX) {
                        this.y += normY;
                    }
                    Dungeon.mapSet(this.x, this.y, this);
                }
            }
        }
    }
}

class Snake extends Monster {

    constructor(x, y) {
        super(x, y, "s"); //S
        this.damaged = false;
    }

    movement() {
        if (this.damaged && this.attack()) {
            let movX = this.normalise(this.x - Player.x);
            let movY = this.normalise(this.y - Player.y);
            if (Dungeon.mapGet(this.x + movX, this.y + movY) instanceof Monster) {
                Dungeon.mapGet(this.x + movX, this.y + movY).health = 0;
                Dungeon.mapGet(this.x + movX, this.y + movY).damage();
                this.c = "S"
            }
            if (Dungeon.mapGet(this.x + movX, this.y + movY) === floor) {
                Dungeon.mapSet(this.x, this.y, floor);
                this.x += movX;
                this.y += movY;
                Dungeon.mapSet(this.x, this.y, this);
            }
            this.damaged = false;
        }
    }

    damage() {
        super.damage();
        this.damaged = true;
    }
}

class Skull extends Monster {

    constructor(x, y) {
        super(x, y, ".");
    }

    movement() {
        let dirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        dirs.sort(() => .5 - Math.random());
        if (this.attack()) {
            let ally = new Player;
            Dungeon.enemies.forEach(enemy => {
                dirs.forEach(opt => {
                    if (Dungeon.mapGet(enemy.x + opt.x, enemy.y + opt.y) === floor) {
                        Dungeon.mapSet(this.x, this.y, floor)
                        this.x = enemy.x + opt.x;
                        this.y = enemy.y + opt.y;
                        Dungeon.mapSet(this.x, this.y, this)
                        return;
                    }
                })
            })
        } else {
            dirs.forEach(opt => {
                if (Dungeon.mapGet(Player.x + opt.x, Player.y + opt.y) === floor) {
                    Dungeon.mapSet(this.x, this.y, floor)
                    this.x = Player.x + opt.x;
                    this.y = Player.y + opt.y;
                    Dungeon.mapSet(this.x, this.y, this)
                    return;
                }
            })
        }
    }

    teleport(target) {
        let dirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        dirs.sort(() => .5 - Math.random());

        dirs.forEach(opt => {
            if (Dungeon.mapGet(target.x + opt.x, target.y + opt.y) === floor) {
                Dungeon.mapSet(this.x, this.y, floor)
                this.x = target.x + opt.x;
                this.y = target.y + opt.y;
                Dungeon.mapSet(this.x, this.y, this)
                return;
            }
        })
    }
}

class Insect extends Monster {

    constructor(x, y) {
        super(x, y, "*");
    }
}