const Rx = require('rx')
const Monet = require('monet')

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const alphabetLength = alphabet.length

function asErrorObservable(error) {
    return Rx.Observable.create(observer => observer.onError(error))
}

exports.textToShifts = text => {
    if (!text || text.length < 1) {
        return Monet.Validation.fail("impossible de déterminer les décalages d'un paramètre vide")
    }

    const shiftTexts = text.split(',')

    const { validShifts, invalidShifts } = shiftTexts.reduce((acc, shiftText) => {
        const parsedShift = Number.parseInt(shiftText)
        if (Number.isNaN(parsedShift)) {
            return { validShifts: acc.validShifts, invalidShifts: [...acc.invalidShifts, shiftText] }
        } else {
            return { validShifts: [...acc.validShifts, parsedShift], invalidShifts: acc.invalidShifts }
        }
    }, {validShifts: [], invalidShifts: []})

    if (invalidShifts.length > 0) {
        return Monet.Validation.fail(`Valeurs de décalage invalides : ${invalidShifts.join(', ')}`)
    } else {
        return Monet.Validation.success(validShifts)
    }
}

exports.code = (shiftsValidation, messageMaybe, encode = true) => {
    if (shiftsValidation.isFail()) {
        return asErrorObservable(shiftsValidation.fail())
    } else if (messageMaybe.isNone()) {
        return asErrorObservable('pas de message fourni')
    }

    const decypherShifts = shiftsValidation.success()
    const decypherShiftsLength = decypherShifts.length
    const cypheredMessageChars = []
    const parseOperator = encode ? -1 : 1

    return Rx.Observable.from(messageMaybe.some())
        .map((messageChar, charIndex) => {
            const charAlphabetIndex = alphabet.indexOf(messageChar)
            let cypheredChar
            if (charAlphabetIndex < 0) {
                cypheredChar = messageChar
            } else {
                const decypherShiftsIndex = charIndex % decypherShiftsLength
                cypheredChar = alphabet.charAt((alphabetLength + charAlphabetIndex + (parseOperator * decypherShifts[decypherShiftsIndex])) % alphabetLength)
            }

            return cypheredChar
        })
        .reduce((text, char) => `${text}${char}`, '')
}

exports.createConsoleObserver = () => Rx.Observer.create(
    codedMessage => console.log(codedMessage),
    error => console.error('😡😲😡', error),
    () => console.log('😊')
)
