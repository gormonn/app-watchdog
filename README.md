# app-watchdog

A package for controlling a Watchdog device from a JavaScript-based application.
Relevant for Electron / WebView. For kiosks and exhibition centers, where there is a problem with the application freezing, and you need a quick solution.

Supported devices:
* [WatchDogPro2](https://open-dev.ru/mining/tproduct/230408497-494995827972-usb-watchdog-pro2)

Supported OS (by [serialport](https://www.npmjs.com/package/serialport)):
* Linux
* Windows
* OSX

Install:
```
yarn add app-watchdog
```

Example usage:
```
const WatchDog = require('app-watchdog');

const logger = (msg) => console.log(msg);

const wd = WatchDog(
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

wd.ALIVE(); // Send alive signal to Watchdog
wd.PAUSE(); // Pause wait timer
wd.RESUME(); // Resume wait timer

wd.LIGHT_ON(); // Turn on the indicator light
wd.LIGHT_OFF(); // Turn off the indicator light

wd.TEST_RESET();
wd.TEST_HARD_RESET();
wd.TEST_POWER_OFF();

wd.PARAMS_SET(9); // Set waitTime before reset to 9 minutes
wd.params; // Get watchdog parameters
wd.port; // Get port info
wd.paramsDefault; // Get default params
```

The main idea was to make this library "modular". To work with various USB Watchdog devices. To achieve this goal, I decided to use mixins.

As planned, you can safely add your modules for specific devices to this repository. Using this [template](https://github.com/gormonn/app-watchdog/blob/main/src/devices/USB_WatchDog_Pro2_2018/index.js). It is important to understand that the keys of the `actionsList` object must remain unchanged. At least **ALIVE**, **PARAMS_GET**, **PARAMS_SET**.
Or, I need to add a plugin system. How do you think?

Any suggestions are greatly appreciated.

Attention!
I have nothing to do with [OpenDev](https://open-dev.ru/watchdog).
Use this at your own risk.

[You can buy me an apple](https://www.buymeacoffee.com/gormonn)

