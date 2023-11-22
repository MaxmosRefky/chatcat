'use strict'

const wiston = require('winston');
const logger = new (wiston.Logger)({
    transports: [
        // new (wiston.transports.File)({
        //     level: 'debug',
        //     filename: './chatCatDebug.log',
        //     handleExceptions: true
        // }),
        new (wiston.transports.Console)({
            level: 'debug',
            json: true,
            handleExceptions: true
        })
    ],
    exitOnError: false //that's mean that if an uncaught exception or an error
    // received, then Wiston will not stop reporting and will not exit 
});

module.exports = logger;