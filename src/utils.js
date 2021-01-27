if(!Object.fromEntries) require('polyfill-object.fromentries');

function createMethod(messageGetter){
    return function(params){
        const message = messageGetter(params);
        // console.log('message', message)
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