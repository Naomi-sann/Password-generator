"use strict";
const characterLengthInput = document.getElementById('charater-length-input'), progressBar = document.getElementById('range-progress'), checkboxInputs = document.querySelectorAll('input[type="checkbox"]'), characterLengthCounter = document.getElementById('character-length-counter');
class password {
    constructor() {
        this.result = "";
        this.length = 0;
        this.upperCase = false;
        this.lowerCase = false;
        this.numbers = false;
        this.symbols = false;
    }
    setCharacterLength(value) {
        this.length = value;
        characterLengthCounter.innerText = this.length.toString();
    }
    toggleOptions(property) {
        this[property] = !this[property];
    }
}
const mainPassword = new password();
function handleInput(e) {
    progressBar.value = e.target.value;
    mainPassword.setCharacterLength(parseInt(e.target.value));
}
function handleCheckbox(e) {
    mainPassword.toggleOptions(e.target.value);
}
characterLengthInput.addEventListener("input", handleInput);
checkboxInputs.forEach(checkbox => checkbox.addEventListener('input', handleCheckbox));
//# sourceMappingURL=index.js.map