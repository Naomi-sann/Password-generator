"use strict";
function toArray(obj) {
    return [...obj];
}
const [copyTippy] = tippy('#copy-button', {
    content: "Copy",
    delay: [300, 600],
    hideOnClick: false,
    onHidden(instance) {
        instance.setContent("Copy");
    },
    theme: "light"
});
const characterLengthInput = document.getElementById('charater-length-input'), progressBar = document.getElementById('range-progress'), checkboxInputs = document.querySelectorAll('input[type="checkbox"]'), characterLengthCounter = document.getElementById('character-length-counter'), generateButton = document.getElementById('generate'), resultTitle = document.getElementById('result'), copyButton = document.getElementById('copy-button'), strengthLevel = document.querySelector('.strength-level ul'), strengthLevelText = document.querySelector('.strength-level span');
var StrengthLevel;
(function (StrengthLevel) {
    StrengthLevel[StrengthLevel["empty"] = 0] = "empty";
    StrengthLevel[StrengthLevel["easy"] = 1] = "easy";
    StrengthLevel[StrengthLevel["medium"] = 2] = "medium";
    StrengthLevel[StrengthLevel["strong"] = 3] = "strong";
})(StrengthLevel || (StrengthLevel = {}));
class strength {
    constructor() {
        this.strengthLevel = StrengthLevel.empty;
        this.hasLengthLevel1 = false;
        this.hasLengthLevel2 = false;
        this.hasUpperCaseLevel = false;
        this.hasLowerCaseLevel = false;
        this.hasNumbersLevel = false;
        this.hasSymbolsLevel = false;
        this.checkedOptionsCount = 0;
    }
    checkStrength(passwordLength, options) {
        for (const opt in options) {
            const option = options[opt];
            const levelOption = `has${opt.replace(opt.charAt(0), opt.charAt(0).toUpperCase())}Level`;
            if (option && !this[levelOption]) {
                this[levelOption] = true;
                this.checkedOptionsCount++;
                this.strengthLevel += 2;
            }
            else if (!option && this[levelOption]) {
                this[levelOption] = false;
                this.checkedOptionsCount--;
                this.strengthLevel -= 2;
            }
        }
        if (passwordLength > 4 && passwordLength <= 7 && !this.hasLengthLevel1) {
            this.hasLengthLevel1 = true;
            this.strengthLevel++;
        }
        else if (passwordLength < 4 && this.hasLengthLevel1) {
            this.hasLengthLevel1 = false;
            this.strengthLevel--;
        }
        if (passwordLength > 7 && !this.hasLengthLevel2) {
            this.hasLengthLevel2 = true;
            this.strengthLevel += 2;
        }
        else if (passwordLength < 7 && passwordLength >= 4 && this.hasLengthLevel2) {
            this.hasLengthLevel2 = false;
            this.strengthLevel -= 2;
        }
        console.log(Math.ceil(this.strengthLevel / 3.5));
    }
}
class password extends strength {
    constructor() {
        super();
        this.result = "";
        this.length = 0;
        this.options = {
            upperCase: false,
            lowerCase: false,
            numbers: false,
            symbols: false,
        };
    }
    setCharacterLength(value) {
        this.length = value;
        characterLengthCounter.innerText = this.length.toString();
        this.checkStrength(this.length, this.options);
    }
    toggleOptions(property) {
        this.options[property] = !this.options[property];
        this.checkStrength(this.length, this.options);
    }
    generatePassword() {
        const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerCaseLetters = upperCaseLetters.toLowerCase();
        const numbers = "1234567890";
        const symbols = "!@#$%^&*-_+=";
        const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
        const availableCharGroups = [];
        this.options.upperCase && availableCharGroups.push(upperCaseLetters);
        this.options.lowerCase && availableCharGroups.push(lowerCaseLetters);
        this.options.numbers && availableCharGroups.push(numbers);
        this.options.symbols && availableCharGroups.push(symbols);
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
console.log(mainPassword);
function showStrength() {
    var _a, _b;
    for (let i = 0; i < 4; i++) {
        (_a = strengthLevel.children.item(i)) === null || _a === void 0 ? void 0 : _a.classList.remove('level-active');
    }
    for (let i = 0; i < mainPassword.strengthLevel; i++) {
        (_b = strengthLevel.children.item(i)) === null || _b === void 0 ? void 0 : _b.classList.add("level-active");
    }
}
function handleInput(e) {
    progressBar.value = e.target.value;
    mainPassword.setCharacterLength(parseInt(e.target.value));
    showStrength();
}
function handleCheckbox(e) {
    mainPassword.toggleOptions(e.target.value);
    showStrength();
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