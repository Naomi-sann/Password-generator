declare const tippy: any;

function toArray<T>(obj: Iterable<T>): T[] {
    return [...obj];
}

const [copyTippy] = tippy('#copy-button', {
    content: "Copy",
    delay: [300, 600],
    hideOnClick: false,
    onHidden(instance) {
        instance.setContent("Copy")
    },
    theme: "light"
});

const characterLengthInput = <HTMLInputElement>document.getElementById('charater-length-input'), progressBar = <HTMLInputElement>document.getElementById('range-progress'),
    checkboxInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[type="checkbox"]'),
    characterLengthCounter = <HTMLHeadingElement>document.getElementById('character-length-counter'),
    generateButton = <HTMLButtonElement>document.getElementById('generate'),
    resultTitle = <HTMLHeadingElement>document.getElementById('result'),
    copyButton = <HTMLButtonElement>document.getElementById('copy-button'),
    strengthLevel = <HTMLUListElement>document.querySelector('.strength-level ul'),
    strengthLevelText = <HTMLUListElement>document.querySelector('.strength-level span');

interface PasswordProperties {
    length: number;
    options: PasswordOptions;
}

interface PasswordOptions {
    upperCase: boolean,
    lowerCase: boolean,
    numbers: boolean,
    symbols: boolean,
}

type ToggleProperty = 'upperCase' | 'lowerCase' | 'numbers' | 'symbols';

interface Password extends PasswordProperties {
    result: string,
    setCharacterLength: (value: number) => void,
    toggleOptions: (property: ToggleProperty) => void
}

enum StrengthLevel {
    empty = 0,
    easy = 1,
    medium = 2,
    strong = 3,
}

interface Strength {
    strengthLevel: StrengthLevel;
    hasLengthLevel1: boolean;
    hasLengthLevel2: boolean;
    hasUpperCaseLevel: boolean;
    hasLowerCaseLevel: boolean;
    hasNumbersLevel: boolean;
    hasSymbolsLevel: boolean;
    checkedOptionsCount: number;
}

class strength implements Strength {
    strengthLevel: StrengthLevel;
    hasLengthLevel1: boolean;
    hasLengthLevel2: boolean;
    hasUpperCaseLevel: boolean;
    hasLowerCaseLevel: boolean;
    hasNumbersLevel: boolean;
    hasSymbolsLevel: boolean;
    checkedOptionsCount: number;

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

    checkStrength(passwordLength: number, options: PasswordOptions) {

        for (const opt in options) {
            const option = options[opt];
            const levelOption = `has${opt.replace(opt.charAt(0), opt.charAt(0).toUpperCase())
                }Level`;


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

class password extends strength implements Password {
    result: string;
    length: number;
    options: {
        upperCase: boolean;
        lowerCase: boolean;
        numbers: boolean;
        symbols: boolean;
    }

    constructor() {
        super();
        this.result = "";
        this.length = 0;
        this.options = {
            upperCase: false,
            lowerCase: false,
            numbers: false,
            symbols: false,
        }
    }

    setCharacterLength(value: number): void {
        this.length = value;
        characterLengthCounter.innerText = this.length.toString();

        this.checkStrength(this.length, this.options);
    }

    toggleOptions(property: ToggleProperty): void {
        this.options[property] = !this.options[property];

        this.checkStrength(this.length, this.options);
    }

    generatePassword(): string {
        const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerCaseLetters = upperCaseLetters.toLowerCase();
        const numbers = "1234567890";
        const symbols = "!@#$%^&*-_+=";

        const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

        const availableCharGroups: string[] = [];

        this.options.upperCase && availableCharGroups.push(upperCaseLetters);
        this.options.lowerCase && availableCharGroups.push(lowerCaseLetters);
        this.options.numbers && availableCharGroups.push(numbers);
        this.options.symbols && availableCharGroups.push(symbols);

        this.result = "";

        if (!availableCharGroups.length) return "";

        for (let i = 0; i < this.length; i++) {
            const randomCharacterGroup: string = availableCharGroups[random(0, availableCharGroups.length - 1)];


            this.result += randomCharacterGroup.charAt(random(0, randomCharacterGroup.length - 1));
        }

        return this.result;
    }
}



const mainPassword: password = new password();
console.log(mainPassword);

function showStrength() {
    for (let i = 0; i < 4; i++) {
        strengthLevel.children.item(i)?.classList.remove('level-active');
    }
    for (let i = 0; i < mainPassword.strengthLevel; i++) {
        strengthLevel.children.item(i)?.classList.add("level-active");
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
    navigator.clipboard.writeText(mainPassword.result).then(() =>
        copyTippy.setContent("Copied")
    ).catch(() =>
        copyTippy.setContent("Could not copy!")
    );
}

characterLengthInput.addEventListener("input", handleInput);
checkboxInputs.forEach(checkbox => checkbox.addEventListener('input', handleCheckbox));
generateButton.addEventListener("click", handleGenerate);
copyButton.addEventListener("click", handleCopy);
