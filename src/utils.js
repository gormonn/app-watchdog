if(!Object.fromEntries) require('polyfill-object.fromentries');


function createMethodsFromActions(actions){
    let methods = {};
    for(let actionType in actions){
        const msg = actions[actionType];
        const isStr = typeof msg === 'string';
        const isFunc = typeof msg === 'function';
        const msgFunction = isFunc
            ? msg
            : () => console.error(`Action Type (method): *${actionType}* is not correct!`)


        const messageGetter = isStr
            ? () => msg
            : msgFunction;
        
        methods[actionType] = createMessage(messageGetter);
    }
    return methods;
}

// function createMixin(actions){
//     const mixin = {
//         dispatch(actionType, params){
//             const methods = createMethodsFromActions(actions)
//             return methods[actionType].call(this, params)
//         }
//     }
//     return mixin
// }

// function createMethod(actions){
//     let methods = {};
//     for(let actionType in actions){
//         const msg = actions[actionType];
//         const isStr = typeof msg === 'string';
//         const isFunc = typeof msg === 'function';
//         const msgFunction = isFunc
//             ? msg
//             : () => console.error(`Action Type (method): *${actionType}* is not correct!`)


//         const messageGetter = isStr
//             ? () => msg
//             : msgFunction;
        
//         methods[actionType] = createMessage(messageGetter);
//     }
//     return methods;
// }

// function createMixin(actions){
//     const mixin = {
//         [actionType](params){
//             const method = createMethod(actions)
//             return method.call(this, params)
//         }
//     }
//     return mixin
// }
function createMethod(messageGetter){
    return function(params){
        const message = messageGetter(params);
        console.log('message', message)
        this.send(message)
    }
}
function createMixin(actions){
    let methods = {};
    for(let actionType in actions){
        const msg = actions[actionType];
        const isStr = typeof msg === 'string';
        const isFunc = typeof msg === 'function';
        const msgFunction = isFunc
            ? msg
            : () => console.error(`Action Type (method): *${actionType}* is not correct!`)


        const messageGetter = isStr
            ? () => msg
            : msgFunction;
        
        methods[actionType] = createMethod(messageGetter.bind(this));
    }
    return methods;
}

module.exports.getMixin = function getMixin({actions, misc}){
    const mixin = Object.assign({}, createMixin(actions), misc);
    // console.log({mixin})
    return mixin
}


// module.exports.getDeviceInfo = function getDeviceInfo({
//     actions,
//     messages,
//     deviceInfo,
//     deviceName,
//     paramsDefault,
//     paramsSerialize,
//     paramsParse
// }){
//     const actionTypes = Object.keys(actions);
//     const actions_const = Object.fromEntries(actionTypes.map(type => ([type, type])));
//     // const messages = swap(actions)

//     const mixin = Object.assign(
//         {},
//         createMixin(actions),
//         {
//             messages,
//             deviceInfo,
//             deviceName,
//             paramsDefault,
//             paramsSerialize,
//             paramsParse
//         }
//     );
//     console.log({mixin})
//     return {
//         mixin,
//         actions: actions_const
//     }
// }