var winston = require('winston');
require('winston-daily-rotate-file');

let logger = winston.createLogger({
    levels: {
        error: 0,
        info: 1,
        debug: 2
    },
    format: winston.format.json(),
    transports: [
        new (winston.transports.Console)({
            colorize: true
        }),
        new (winston.transports.DailyRotateFile)({
            dirname: '../logs',
            filename: '%DATE%-INFO.log',
            datePattern: 'YYYY-MM-DD',
            prepend: true,
            level: 'info',
            createTree: true,
            json: true,
            zippedArchive: true
        }),
        new (winston.transports.DailyRotateFile)({
            dirname: '../logs',
            filename: '%DATE%-ERROR.log',
            datePattern: 'YYYY-MM-DD',
            prepend: true,
            level: 'error',
            createTree: true,
            json: true,
            zippedArchive: true
        }),
        new (winston.transports.DailyRotateFile)({
            dirname: '../logs',
            filename: '%DATE%-DEBUG.log',
            datePattern: 'YYYY-MM-DD',
            prepend: true,
            level: 'debug',
            createTree: true,
            json: true,
            zippedArchive: true
        }),
    ]
});

module.exports = logger;
