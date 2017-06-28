const Monet = require('monet')
const { code, textToShifts, createConsoleObserver } = require('./index.js')

// retrieves the environment configuration from the arguments
if (process.argv.length < 4) {
    console.error('Ce script doit être exécuté avec 2 arguments `node encode.js {décalages} {message}`, où {décalages} est de la forme "5,-6,2"');
    process.exit(1);
}

const shiftsValidation = textToShifts(process.argv[2])
const messageMaybe = Monet.Maybe.fromNull(process.argv[3])

code(shiftsValidation, messageMaybe, false).subscribe(createConsoleObserver())
