"use strict";
const [copyTippy] = tippy('#copy-button', {
    content: "Copy",
    delay: [300, 600],
    hideOnClick: false,
    onHidden(instance) {
        instance.setContent("Copy");
    },
    theme: "light"
});
const characterLengthInput = document.getElementById('charater-length-input'), progressBar = document.getElementById('range-progress'), checkboxInputs = document.querySelectorAll('input[type="checkbox"]'), characterLengthCounter = document.getElementById('character-length-counter'), generateButton = document.getElementById('generate'), resultTitle = document.getElementById('result'), copyButton = document.getElementById('copy-button');
var Strength;
(function (Strength) {
    Strength[Strength["empty"] = 0] = "empty";
    Strength[Strength["easy"] = 1] = "easy";
    Strength[Strength["medium"] = 2] = "medium";
    Strength[Strength["strong"] = 3] = "strong";
})(Strength || (Strength = {}));
class password {
    constructor() {
        this.result = "";
        this.strength = Strength.empty;
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
    generatePassword() {
        const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerCaseLetters = upperCaseLetters.toLowerCase();
        const numbers = "1234567890";
        const symbols = "!@#$%^&*-_+=";
        const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
        const availableCharGroups = [];
        this.upperCase && availableCharGroups.push(upperCaseLetters);
        this.lowerCase && availableCharGroups.push(lowerCaseLetters);
        this.numbers && availableCharGroups.push(numbers);
        this.symbols && availableCharGroups.push(symbols);
        this.result = "";
        if (!availableCharGroups.length)
            return "";
        for (let i = 0; i < this.length; i++) {
            const randomCharacterGroup = availableCharGroups[random(0, availableCharGroups.length - 1)];
            this.result += randomCharacterGroup.charAt(random(0, randomCharacterGroup.length - 1));
        }
        return this.result;
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
function handleGenerate() {
    const generatedPassword = mainPassword.generatePassword();
    if (generatedPassword !== "") {
        resultTitle.innerText = generatedPassword;
        resultTitle.className = "";
    }
    else {
        resultTitle.innerText = "Empty";
        resultTitle.className = "empty-password";
    }
}
function handleCopy() {
    navigator.clipboard.writeText(mainPassword.result).then(() => copyTippy.setContent("Copied")).catch(() => copyTippy.setContent("Could not copy!"));
}
characterLengthInput.addEventListener("input", handleInput);
checkboxInputs.forEach(checkbox => checkbox.addEventListener('input', handleCheckbox));
generateButton.addEventListener("click", handleGenerate);
copyButton.addEventListener("click", handleCopy);
//# sourceMappingURL=index.js.map