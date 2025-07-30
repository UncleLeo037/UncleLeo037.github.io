var array = []

function generate(length) {
    for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 10);
    }
    document.getElementById("input").innerText = array
    document.getElementById("output").innerText = ""
}

function output() {
    document.getElementById("output").innerText = array
}

function bubble() {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < (array.length - i - 1); j++) {
            if (array[j] > array[j + 1]) {
                var temp = array[j]
                array[j] = array[j + 1]
                array[j + 1] = temp
            }
        }
    }
    output()
}

function selection() {
    n = array.length
    for (let i = 0; i < n - 1; i++) {
        let min_index = i
        for (let j = i + 1; j < n; j++) {
            if (array[j] < array[min_index]) {
                min_index = j
            }
        }

        let temp = array[i]
        array[i] = array[min_index]
        array[min_index] = temp
    }
    output()
}

function insertion() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i]
        let j = i - 1

        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j]
            j = j - 1
        }
        array[j + 1] = key
    }
    output()
}

function quick() {

    output()
}

function heap() {

    output()
}