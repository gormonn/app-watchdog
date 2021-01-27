// https://files.digiowls.org/doc/usb-watchdog-pro2-2018.pdf
const ALIVE = 'ALIVE';
const PAUSE = 'PAUSE';
const RESUME = 'RESUME';
const LIGHT_ON = 'LIGHT_ON';
const LIGHT_OFF = 'LIGHT_OFF';
const PARAMS_GET = 'PARAMS_GET';
const PARAMS_SET = 'PARAMS_SET';
const TEST_RESET = 'TEST_RESET';
const TEST_HARD_RESET = 'TEST_HARD_RESET';
const TEST_POWER_OFF = 'TEST_POWER_OFF';

const actionsList = {
    [ALIVE]: '~U',

    [PAUSE]: '~P1',
    [RESUME]: '~P0',

    [LIGHT_ON]: '~L1',
    [LIGHT_OFF]: '~L0',

    [PARAMS_GET]: '~F',
    [PARAMS_SET]: '~W',

    [TEST_RESET]: '~T1',
    [TEST_HARD_RESET]: '~T2',
    [TEST_POWER_OFF]: '~T3',
}

function swap(obj) {
    const res = {};
  
    Object.keys(obj).forEach(function(value) {
      var key = obj[value];
      res[key] = value;
    });
    return res;
}

// TODO: remove _blablabla, resolve maxHeap, etc.
const paramsDefault = {
    waitTime: '5', // Ожидание сигнала перезагрузки t1
    t2: '2', // Длительность импульса сигнала "Reset" t2
    t3: '5', // Длительность импульса сигнала "Power" t3
    t4: '3', // Длительность ожиданий t4
    t5: '2', // Длительность импульса сигнала "Power" t5
    channelMode1: '1', // Режим канала: 1: 0-выкл, 1-RESET, 2-POWER, 3-Управляемый(нач.сост.-открыт), 4-Управляемый(нач.сост.-закрыт)
    channelMode2: '2', // Режим канала: 2: 0-выкл, 1-RESET, 2-POWER, 3-Управляемый(нач.сост.-открыт), 4-Управляемый(нач.сост.-закрыт)
    resetCount: '0', // Ограничение кол-ва перезагрузок. 0-нет ограничений
    channelMode3: '3', // Режим канала 3 (Bx/Ln): 0-выкл, 1-дискретный вход, 3-вход датчика температуры ds18b20
    maxHeap: '00',// Пороговое значение температуры для автоматического перезапуска. Актуально при канале 3 (Bx/Ln) = 3. в шестнадцатеричном формате, например: 32 градуса - 20, 80 градусов - 50, 00 - отключено
}

function objValues2String(params){
    // имеет значение порядок параметров в объекте 
    return Object.values(params).join('')
}

function paramsSetWaitTime(waitTime){
    const result = paramsSet({waitTime})
    return result;
}

function paramsSet(params){
    const cmdSuffix = actionsList[PARAMS_SET];
    if(!params){
        return `${cmdSuffix}${objValues2String(paramsDefault)}`
    }
    const newParams = Object.assign({}, paramsDefault, params)
    return `${cmdSuffix}${objValues2String(newParams)}`
}

function paramsParse(message){
    const [
        suffix, command,
        waitTime,
        t2,
        t3,
        t4,
        t5,
        channelMode1,
        channelMode2,
        resetCount,
        channelMode3,
        maxHeap1, maxHeap2
    ] = message
    const cmd = suffix + command
    const maxHeap = maxHeap1 + maxHeap2
    return {
        waitTime,
        t2, t3, t4, t5,
        channelMode1,
        channelMode2,
        resetCount,
        channelMode3,
        maxHeap
    }
}

function portDataHandler(data){
    const result = data.toString();
    this.outputGet(result)
    switch(0){
        case result.indexOf(actionsList[PAUSE]):{
            return this.outputLog('Watchdog: Wait timer was paused!');
        }
        case result.indexOf(actionsList[RESUME]):{
            return this.outputLog('Watchdog: Wait timer was resumed!');
        }
        default:{            
            if(new RegExp(actionsList[PARAMS_GET]).test(result)){
                this.params = this.paramsParse(result);
                // match params
                if(this.params.waitTime !== this.waitTime){
                    this.PARAMS_SET(this.waitTime)
                    return this.outputLog(`Watchdog: params was changed! waitTime: ${this.waitTime}`)
                }
            }
            break;
        }
    }
}

const actionFunctions = {
    [PARAMS_SET]: paramsSetWaitTime
}

module.exports = {
    actions: Object.assign({}, actionsList, actionFunctions),
    misc: {
        deviceName: 'WatchDogPro2',
        messages: swap(actionsList),
        deviceInfo: {
            manufacturer: 'Open Development',
            serialNumber: 'XXX',
            pnpId: 'usb-Open_Development_USB_Watchdog_XXX-if00',
            locationId: undefined,
            vendorId: '0483',
            productId: 'a26d',
            findPort: () => (port) => /usb-Open_Development_USB_Watchdog/i.test(port.pnpId),
            // path: '/dev/ttyACM0'
        },
        portDataHandler,
        paramsDefault,
        params: false,
        paramsParse,
        paramsSetWaitTime,
        // paramsSet,
        // objValues2String,
    }
}