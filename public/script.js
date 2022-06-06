let sections = document.getElementsByClassName("section")
let buttons = document.querySelectorAll(".buttons span, .buttons button")
let formInputs = document.querySelectorAll("#onboarding label input, #onboarding select")
let indicators = document.querySelectorAll(".indicators span")
let index = 0

let sectionsArray = Array.from(sections)
let formInputsArray = Array.from(formInputs)

const checkIndex = () => {
    if(index === 0) {
        buttons[0].style.display = "block"
        buttons[1].style.display = "none"
        buttons[2].style.display = "none"
        indicators[0].classList.add("active")
        indicators[1].classList.remove("active")
        indicators[2].classList.remove("active")
        indicators[3].classList.remove("active")
    }
    if(index === 1) {
        buttons[0].style.display = "block"
        buttons[1].style.display = "none"
        buttons[2].style.display = "block"
        indicators[0].classList.add("active")
        indicators[1].classList.add("active")
        indicators[2].classList.remove("active")
        indicators[3].classList.remove("active")
    }
    if(index === 2) {
        buttons[0].style.display = "none"
        buttons[1].style.display = "block"
        buttons[2].style.display = "block"
        indicators[0].classList.add("active")
        indicators[1].classList.add("active")
        indicators[2].classList.add("active")
        indicators[3].classList.remove("active")
    }
}
checkIndex()

for(let i=0; i<buttons.length; i++) {
    buttons[i].addEventListener("click", (e) => {

        let errors = []
        
        if(errors.length > 0) {
            e.preventDefault()
        }
        console.log(errors)
        
        if(formInputsArray[0].value.length < 4) {
            errors.push({ type: "name", msg: "Full name should be more than 4 letters"})
            console.log(errors)
            return false
        }
        else if( /^\S+@\S+\.\S+$/.test(formInputsArray[1].value) === false) {
            errors.push({ type: "email", msg: "Please check email format"})
            console.log(errors)
            return false
        }

        if(buttons[i].textContent === "Next") {
            index++
            for(let j=0; j<sectionsArray.length; j++) {
                sections[j].style.display = "none"
            }
            sections[index].style.display = "block"
            checkIndex()
        }

        if(formInputsArray[2].value.length < 3) {
            errors.push({ type: "workspace", msg: "workspace is required"})
            console.log(errors)
            return false
        }

        if(buttons[i].textContent === "Back") {
            index--
            for(let j=0; j<sectionsArray.length; j++) {
                sections[j].style.display = "none"
            }
            sections[index].style.display = "block"
            checkIndex()
        }

        else if(formInputsArray[4].value.length < 7) {
            errors.push({ type: "password", msg: "Password should be more than 7 chracters"})
            console.log(errors)
            return false
        }
        else if(formInputsArray[4].value !== formInputsArray[5].value) {
            errors.push({ type: "cpassword", msg: "Passwords do not match"})
        console.log(errors)
            return false
        }

    })
}