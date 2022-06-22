//all.ejs scripts

//Sets input fields to required across all views
const inputs = document.querySelectorAll('input')

for (let input of inputs){
    input.required = true;
}
