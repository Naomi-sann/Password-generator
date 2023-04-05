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
    medium1 = 2,
    medium2 = 3,
    strong = 4,
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
            }
            else if (!option && this[levelOption]) {
                this[levelOption] = false;
                this.checkedOptionsCount--;
            }
        }

        this.strengthLevel = 0;

        if (this.checkedOptionsCount === 0) {
            this.strengthLevel = StrengthLevel.empty;
            return;
        }
        if (passwordLength > 7 && this.checkedOptionsCount === 4) {
            this.strengthLevel = StrengthLevel.strong;
            return;
        }
        if ((passwordLength > 7 && this.checkedOptionsCount === 3) || (passwordLength > 4 && this.checkedOptionsCount === 4)) {
            this.strengthLevel = StrengthLevel.medium2;
            return;
        }
        if ((passwordLength > 4 && this.checkedOptionsCount === 3) || (passwordLength > 10 && this.checkedOptionsCount === 2)) {
            this.strengthLevel = StrengthLevel.medium1;
            return;
        }

        this.strengthLevel = StrengthLevel.easy;
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

function showStrength() {
    let strengthColor: string = "unset";
    let levelDifficulty: "EMPTY" | "EASY" | "MEDIUM" | "STRONG" = "EMPTY";

    if (mainPassword.strengthLevel === 2 || mainPassword.strengthLevel === 3) {
        strengthColor = "#f8ce60";
        levelDifficulty = "MEDIUM";
    }
    else if (mainPassword.strengthLevel === 4) {
        strengthColor = "#a4ffaf";
        levelDifficulty = "STRONG";
    }
    else if (mainPassword.strengthLevel === 1) {
        strengthColor = "gray";
        levelDifficulty = "EASY";
    }

    const listItems = <HTMLCollectionOf<HTMLLIElement>>strengthLevel.children;

    for (let i = 0; i < listItems.length; i++) {
        strengthLevel.children.item(i)?.classList.remove('level-active');

        listItems.item(i)?.style.setProperty('--active-color', strengthColor);
    }
    for (let i = 0; i < mainPassword.strengthLevel; i++) {
        listItems.item(i > listItems.length - 1 ? 3 : i)?.classList.add("level-active");
    }

    strengthLevelText.innerText = levelDifficulty;
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
