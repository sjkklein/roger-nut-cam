//all.ejs scripts

//Sets input fields to required across all views and responsive input text
const inputs = document.querySelectorAll('input')

for (let input of inputs) {
    input.required = true;
    input.classList.add('form-control')
}

//Sets all buttons to dark mode
const buttons = document.querySelectorAll('button')

for (let button of buttons) {
    button.classList.add('btn-dark')
}

//CENTERS DIVS FUCK CENTERING DIVS FUCK

const divControls = document.querySelector('#control') 

divControls.classList.add('d-flex', 'align-items-center', 'justify-content-center')

const boxes = document.querySelectorAll('#box') 

for (let box of boxes) {
    box.classList.add('container')
}

//Background Animation, to be implemented...