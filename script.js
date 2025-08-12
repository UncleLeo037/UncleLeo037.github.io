//sets iframe to home page at start
        navigate('home')

        function navigate(id) {
            document.getElementById('frame').src = `pages/${id}.html`
            var current = document.getElementsByClassName('active')
            while (current.length) {
                current[0].classList.remove('active')
            }
            document.getElementById(id).classList.add('active')
        }

        function showMenu() {
            var navbar = document.getElementById("navbar")
            var frame = document.getElementById("frame")
            if (navbar.style.display === "none") {
                navbar.style.display = "block"
                frame.style.width = "90%"
            } else {
                navbar.style.display = "none"
                frame.style.width = "100%"
            }
        }