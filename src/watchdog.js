console.time('wd');
const SerialPort = require('serialport')
const {getMixin} = require('./utils')
const devices = require('./devices')

class SerialConnector{
    constructor(deviceParams, props){
        this.params = false;// Object.assign({}, this.paramsDefault, deviceParams);
        
        const {
            messageInterval = 1000,
            testTimeout = false,
            outputGet= ()=>{},
            outputSent = ()=>{},
            outputLog = ()=>{},
            outputErr = ()=>{},
            // listenOnly = false
        } = props;

        this.testTimeout = testTimeout;
        // this.listenOnly = listenOnly
        // this.onFail = onFail;
        this.outputGet = outputGet;
        this.outputSent = outputSent;
        this.outputLog = outputLog;
        this.outputErr = outputErr;

        this.waitTime = String(deviceParams.waitTime);
        this.messageInterval = messageInterval;
        this.onPortOpen = this.onPortOpen.bind(this);
        this.onPortClose = this.onPortClose.bind(this);
        this.onPortError = this.onPortError.bind(this);

        this.portDataHandler = this.portDataHandler.bind(this)
    }
    init(){
        if(this.waitTime >= 10){
            this.outputErr('Watchdog: WaitTime can be 0-9 min')
            return this;
        }
        try{
            SerialPort.list().then(ports => {
                const { findPort } = this.deviceInfo;
                this.port = ports.find(findPort)
                if (!this.port) {
                    // this.onFail()
                    return this.outputErr('Watchdog: Not found')
                }
                this.outputErr('Watchdog: was found!')
                this.connect()
            })
            return this;
        }catch(err){
            this.outputErr(`Watchdog InitError: ${err.message}`)
            return this;
        }
    }
    connect(){
        this.watchDog = new SerialPort(this.port.path);//, { autoOpen: false })
        this.watchDog.on('open', this.onPortOpen)
        this.watchDog.on('close', this.onPortClose)
        // Switches the port into "flowing mode"
        this.watchDog.on('data', this.portDataHandler)
        this.watchDog.on('error', this.onPortError)
    }
    onPortError(err){
        this.outputErr(`Watchdog PortError: ${err.message}`)
    }
    onPortOpen(err){
        this.outputLog('WatchDog: open port')
        if (err) {
            // this.onFail()
            this.outputLog('WatchDog: Error opening port: ' + err.message)
            return this.init()
        }        
        this.PARAMS_GET();

        if(this.messageInterval){
            this.interval = setInterval(()=>{
                this.ALIVE()
            }, this.messageInterval)
        }
        
        if(this.testTimeout){
            setTimeout(() => {
                clearInterval(this.interval)
            }, this.testTimeout);
        }
    }
    onPortClose(){
        // this.init();
        this.outputLog('WatchDog: close port')
        console.timeEnd('wd');
        process.exit()
    }
    send(message){
        this.watchDog.write(message)
        this.outputSent(message)
    }
}

module.exports = function WatchDog(deviceParams = {}, props = {}, deviceName = 'WatchDogPro2'){
    const device = devices[deviceName];
    const mixin = getMixin(device);
    Object.assign(SerialConnector.prototype, mixin)
    return new SerialConnector(deviceParams, props)
}


// const wd = WatchDog(
//     {waitTime: 1},
//     {messageInterval: 2000},
// ).init()