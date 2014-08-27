var Q = require('q');
var _ = require('lodash');
var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var climatelib = require('climate-si7005');
var Reportr = require('reportr-api');

var config = require("./config");

console.log("Preparing with port: for climate="+config.ports.climate+", for ambient="+config.ports.ambient);
var climate = climatelib.use(tessel.port[config.ports.climate]);
var ambient = ambientlib.use(tessel.port[config.ports.ambient]);

var ambientReady = false, climateReady = false;

var client = new Reportr({
    host: config.host,
    auth: config.auth
});


var track = function() {
    var properties = {};

    return Q.nfcall(ambient.getSoundBuffer.bind(ambient))
    .then(function(sounds) {
        var sound = _.reduce(sounds, function(n, x) { return n + x; }, 0)/sounds.length;
        console.log("sound=", sound);
        properties.sound = sound;

        return Q.nfcall(ambient.getLightBuffer.bind(ambient));
    })
    .then(function(lights) {
        var light = _.reduce(lights, function(n, x) { return n + x; }, 0)/lights.length;
        console.log("light=", light);
        properties.light = light;

        return Q.nfcall(climate.readTemperature.bind(climate));
    })
    .then(function(temperature) {
        console.log("temperature=", temperature);
        properties.temperature = temperature;

        return Q.nfcall(climate.readHumidity.bind(climate));
    })
    .then(function(humidity) {
        console.log("humidity=", humidity);
        properties.humidity = humidity;

        return client.postEvent(config.eventName, properties);
    })
    .then(function() {
        console.log("Sent!");
    }, function(err) {
        console.log("Error", err);
    });
};

var start = function() {
    if (!ambientReady || !climateReady) return;
    console.log("start tracking with interval", config.interval/1000, "seconds");
    setInterval(track, config.interval);
    track();
};


climate.on('ready', function () {
    console.log("climate is ready");
    climateReady = true;
    start();
});

ambient.on('ready', function () {
    console.log("ambient is ready");
    ambientReady = true;
    start();
});

ambient.on('error', function (err) {
    console.log(err);
});
climate.on('error', function (err) {
    console.log(err);
});
