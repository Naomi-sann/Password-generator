const characterLengthInput = <HTMLInputElement>document.getElementById('charater-length-input'), progressBar = <HTMLInputElement>document.getElementById('range-progress'),
    checkboxInputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('input[type="checkbox"]'),
    characterLengthCounter = <HTMLHeadingElement>document.getElementById('character-length-counter');

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

class password implements Password {
    result: string;
    length: number;
    upperCase: boolean;
    lowerCase: boolean;
    numbers: boolean;
    symbols: boolean;

    constructor() {
        this.result = "";
        this.length = 0;
        this.upperCase = false;
        this.lowerCase = false;
        this.numbers = false;
        this.symbols = false;
    }

    setCharacterLength(value: number) {
        this.length = value;
        characterLengthCounter.innerText = this.length.toString();
    }

    toggleOptions(property: ToggleProperty) {
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
checkboxInputs.forEach(checkbox => checkbox.addEventListener('input', handleCheckbox))