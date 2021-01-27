const WD = require('./src/index')

const logger = (msg) => console.log(msg);

const wd = WD(
    {waitTime: 1},
    {
        messageInterval: 2000,
        outputGet: (msg) => console.log('get message:', msg),
        outputSent: (msg) => console.log('sent message:', msg),
        outputLog: logger,
        outputErr: logger,
        onStart: () => console.log(msg)
    },
).init()