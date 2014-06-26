var Q = require('q');
var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var climatelib = require('climate-si7005');

var config = require("./config");

var climate = climatelib.use(tessel.port[config.ports.climate]);
var ambient = ambientlib.use(tessel.port[config.ports.ambient]);

var ambientReady = false, climateReady = false;


var track = function() {
    return Q.all([
        Q.nfcall(ambient.getSoundLevel, ambient)
        Q.nfcall(ambient.getLightLevel, ambient),
        Q.nfcall(climate.readTemperature, climate),
        Q.nfcall(climate.readHumidity, climate)
    ])
    .spread(function(sound, light, temperature, humidity) {
        var properties = {
            'temperature': temperature,
            'humidity': humidity,
            'sound': sound,
            'light': light
        };

        return Q.nfcall(request.post, 'http://some.server.com/', {
            'json': true,
            'auth': {
                'user': config.auth.username,
                'pass': config.auth.password,
                'sendImmediately': false
            },
            'body': JSON.stringify({
                'type': config.eventName,
                'properties': properties
            })
        }));
    })
    .then(function() {
        console.log("Sent!");
    }, function(err) {
        console.log("Error", err);
    })
};

var start = function() {
    setInterval(track, config.interval);
};


climate.on('ready', function () {
    climateReady = true;
    start();
});

ambient.on('ready', function () {
    ambientReady = true;
    start();
});

ambient.on('error', function (err) {
    console.log(err);
});
climate.on('error', function (err) {
    console.log(err);
});
