class Dungeon {
    static #height = 32
    static #width = this.#height * 2
    static #num = 6
    static #min = 5
    static #max = 10
    static enemies = []
    static #map = Array(this.#height).fill().map(() => Array(this.#width))

    static generate() {

        //make map empty
        this.#map.forEach(line => line.fill(back))

        //create and place rooms
        let coords = []
        while (coords.length < this.#num) {
            let room = {
                height: Math.floor(Math.random() * (this.#max - this.#min)) + this.#min,
                width: Math.floor(Math.random() * (this.#max - this.#min)) + this.#min,
                yCoord: Math.floor(Math.random() * this.#height),
                xCoord: Math.floor(Math.random() * this.#width),
            }
            if (!(room.xCoord + room.width > this.#width || room.yCoord + room.height > this.#height)) {
                coords.push({
                    y: room.yCoord + Math.floor(room.height / 2),
                    x: room.xCoord + Math.floor(room.width / 2)
                })
                this.#roomToArray(room)

            }
        }

        //loop through coords and add shortest pairs to corridors
        for (let i = 0; i < coords.length - 1; i++) {
            let goal = coords[i + 1]
            let dist = getDist(coords[i], goal)
            for (let j = i + 2; j < coords.length; j++) {
                let temp = getDist(coords[i], coords[j])
                if (temp < dist) {
                    dist = temp
                    goal = coords[j]
                }

            }
            this.#corridorToArray({ y: [coords[i].y, goal.y], x: [[coords[i].x], goal.x] })
        }

        //place player and exit
        Player.x = coords[coords.length - 1].x
        Player.y = coords[coords.length - 1].y
        this.#map[Player.y][Player.x] = Player //very important that only player coords dictate player location

        this.#map[coords[0].y][coords[0].x] = portal

        //fills array with chests and monsters
        this.#chestToArray()

        //code that outputs array to screen
        this.toHypertext()
    }

    static mapGet(x, y) {
        return this.#map[y][x]
    }

    static mapSet(x, y, item) {
        this.#map[y][x] = item
    }

    static toHypertext() {
        let hyperText = ""
        for (let i = 0; i < this.#map.length; i++) {
            hyperText += this.#map[i].join("") + "<br>"
        }
        document.getElementById("display").innerHTML = hyperText
    }

    //adds HTML accurate elements to array for rooms
    static #roomToArray(room) {
        for (let i = room.yCoord; i < room.yCoord + room.height; i++) {
            for (let j = room.xCoord; j < room.xCoord + room.width; j++) {
                if (!(this.#map[i][j] === floor)) {
                    if (i == room.yCoord || i == room.yCoord + room.height - 1) {
                        this.#map[i][j] = h_wall
                    } else if (j == room.xCoord || j == room.xCoord + room.width - 1) {
                        this.#map[i][j] = v_wall
                    } else {
                        this.#map[i][j] = floor
                    }
                }
            }
        }
    }

    //adds HTML accurate elements to array for corridors
    static #corridorToArray(c) {
        for (let i = Math.min(...c.y); i < Math.max(...c.y) + 1; i++) {
            this.#map[i][c.x[1]] = floor
            if (this.#map[i][c.x[1] - 1] === back) {
                this.#map[i][c.x[1] - 1] = v_wall
            }
            if (this.#map[i][c.x[1] + 1] === back) {
                this.#map[i][c.x[1] + 1] = v_wall
            }
        }
        for (let j = Math.min(...c.x); j < Math.max(...c.x) + 1; j++) {
            this.#map[c.y[0]][j] = floor
            if (this.#map[c.y[0] - 1][j] === back) {
                this.#map[c.y[0] - 1][j] = h_wall
            }
            if (this.#map[c.y[0] + 1][j] === back) {
                this.#map[c.y[0] + 1][j] = h_wall
            }
        }
    }

    //populates map with enemies
    static #chestToArray() {
        for (let y = 1; y < this.#height - 1; y++) {
            for (let x = 1; x < this.#width - 1; x++) {
                let chance = Math.random()

                if (chance < 0.15) {
                    //checks location won't block paths
                    let open = true
                    for (let i = y - 1; i <= y + 1; i++) {
                        for (let j = x - 1; j <= x + 1; j++) {
                            if (this.#map[i][j] != floor) {
                                open = false
                            }
                        }
                    }

                    if (open) {
                        if (chance > 0.1) {
                            this.#map[y][x] = new Chest()
                        } else {
                            let mons = Object.values(monsEnum)
                            let rng = Math.floor(chance * mons.length * 10)
                            let temp = new Monster(1, x, y, mons[rng], 1, 1, 1, 1)
                            this.#map[y][x] = temp
                            this.enemies.push(temp)
                        }
                    }
                }
            }
        }
    }
}