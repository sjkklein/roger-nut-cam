//register.ejs scripts

const firstName = document.querySelector('#firstName')
const lastName = document.querySelector('#lastName')
const password = document.querySelector('#passwordReg')
const passwordConfirm = document.querySelector('#passwordConfirm')
const submit = document.querySelector('#submitRegister')


submit.addEventListener('submit', function() {
    if (password.val() !== passwordConfirm.val()) {
        password.val() == null;
        passwordConfirm.val() == null;
        alert('Passwords do not match!')
    }
})
