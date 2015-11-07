var Config = require('./config.json'),
    colors = require('colors');

function getTime() {
    var time = new Date();
    return time.toDateString().substring(4) + ' - ' + time.toTimeString().substring(0,8);
}

function stringify (args) {
    if (typeof args === 'object') {
        args = JSON.stringify(args);
    }
    return args;
}

exports.debug = function() {
    if (Config.debug === true) {
        for (var i = 0; i < arguments.length; i++) {
            console.log(getTime() + (' [quatschen DEBUG] ' + stringify(arguments[i])).blue);
        }
    }
};

exports.info = function () {
    for (var i = 0; i < arguments.length; i++) {
        console.log(getTime() + (' [quatschen] ' + stringify(arguments[i])).green);
    }
};


exports.error = function() {
    for (var i = 0; i < arguments.length; i++) {
        console.log(getTime() + (' [quatschen ERROR] ' + stringify(arguments[i])).red);
    }
};
