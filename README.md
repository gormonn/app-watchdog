# app-watchdog

A package for controlling a Watchdog device from a JavaScript-based application.
Relevant for Electron / WebView. For kiosks and exhibition centers, where there is a problem with the application freezing, and you need a quick solution.

Supported devices:
* [WatchDogPro2](https://open-dev.ru/mining/tproduct/230408497-494995827972-usb-watchdog-pro2)

Example usage:
```
const WatchDog = require('app-watchdog');

const wd = WatchDog(
    {waitTime: 1},
    {messageInterval: 2000},
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
