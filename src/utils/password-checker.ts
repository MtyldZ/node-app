const letter = new RegExp('[a-zA-Z]');
const oneDigit = new RegExp('[0-9]')

// returns true iff password has at least a letter and a digit

export function passwordChecker(password: string) {
    return letter.test(password) && oneDigit.test(password);
}
