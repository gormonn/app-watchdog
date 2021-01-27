const SerialPort = require('serialport')
const {getMixin} = require('./utils')
const devices = require('./devices')

class SerialConnector{
    constructor(deviceParams, props){
        this.params = Object.assign({}, this.paramsDefault, deviceParams);
        
        const {
            messageInterval = 1000
        } = props;

        this.waitTime = String(deviceParams.waitTime);
        this.messageInterval = messageInterval;
        this.onPortOpen = this.onPortOpen.bind(this)
        this.onPortClose = this.onPortClose.bind(this)

        this.portDataHandler = this.portDataHandler.bind(this)
    }
    init(){
        if(this.waitTime >= 10) return console.error('Watchdog: WaitTime can be 0-9 min')
        SerialPort.list().then(ports => {
            const { findPort } = this.deviceInfo;
            this.port = ports.find(findPort)
            if (!this.port) {;
                return console.error('Watchdog: Not found')
            }
            console.error('Watchdog: was found!')
            this.connect()
        })
        return this;
    }
    connect(){
        this.watchDog = new SerialPort(this.port.path, { autoOpen: false })
        this.watchDog.open(this.onPortOpen)
        this.watchDog.on('close', this.onPortClose)
        // Switches the port into "flowing mode"
        this.watchDog.on('data', this.portDataHandler)
    }
    onPortOpen(err){
        console.log('WatchDog: open port')
        if (err) {
            return console.log('WatchDog: Error opening port: ', err.message)
        }        
        this.PARAMS_GET();

        if(this.messageInterval){
            this.interval = setInterval(()=>{
                this.ALIVE()
            }, this.messageInterval)
        }
    }
    onPortClose(){
        // this.init();
        console.log('WatchDog: close port')
    }
    send(message){
        this.watchDog.write(message)
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