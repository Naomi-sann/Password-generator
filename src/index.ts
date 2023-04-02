declare const tippy: any;

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
    copyButton = <HTMLButtonElement>document.getElementById('copy-button');

interface PasswordProperties {
    length: number,
    upperCase: boolean,
    lowerCase: boolean,
    numbers: boolean,
    symbols: boolean
}

type ToggleProperty = 'upperCase' | 'lowerCase' | 'numbers' | 'symbols';

interface Password extends PasswordProperties {
    result: string,
    setCharacterLength: (value: number) => void,
    toggleOptions: (property: ToggleProperty) => void
}

enum Strength {
    empty = 0,
    easy = 1,
    medium = 2,
    strong = 3,
}

class password implements Password {
    result: string;
    strength: Strength;
    length: number;
    upperCase: boolean;
    lowerCase: boolean;
    numbers: boolean;
    symbols: boolean;

    constructor() {
        this.result = "";
        this.strength = Strength.empty;
        this.length = 0;
        this.upperCase = false;
        this.lowerCase = false;
        this.numbers = false;
        this.symbols = false;
    }

    setCharacterLength(value: number): void {
        this.length = value;
        characterLengthCounter.innerText = this.length.toString();
    }

    toggleOptions(property: ToggleProperty): void {
        this[property] = !this[property];
    }

    generatePassword(): string {
        const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerCaseLetters = upperCaseLetters.toLowerCase();
        const numbers = "1234567890";
        const symbols = "!@#$%^&*-_+=";

        const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

        const availableCharGroups: string[] = [];

        this.upperCase && availableCharGroups.push(upperCaseLetters);
        this.lowerCase && availableCharGroups.push(lowerCaseLetters);
        this.numbers && availableCharGroups.push(numbers);
        this.symbols && availableCharGroups.push(symbols);

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
