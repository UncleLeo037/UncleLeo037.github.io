function navigate(id) {
    document.getElementById('frame').src = `pages/${id}.html`
    var current = document.getElementsByClassName('active')
    while (current.length) {
        current[0].classList.remove('active')
    }
    document.getElementById(id).classList.add('active')
}

function generate() {
    var amount = 20;
    var search = 3;

    var array = [];

    for (let i = 0; i < amount; i++) {
        array[i] = Math.floor(Math.random() * 10);
    }
    console.log(array);
}