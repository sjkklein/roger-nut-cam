// home.ejs & viewPage.ejs scripts

const links = document.querySelectorAll('.disabledOnLog')

for (let link of links) {
    link.classList.add('disabled')
}

const h1 = document.querySelector('#welcomeh1')


setInterval(function () {
    const r = Math.random()*256
    const g = Math.random()*256
    const b = Math.random()*256
    h1.style.color = `rgb(${r},${g},${b})`
}, 100)