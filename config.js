module.exports = {
    interval: 1*60*1000,
    eventName: "room.state",
    host: "http://me.reportr.io",
    auth: {
        username: "test",
        password: "test"
    },
    ports: {
        climate: "A",
        ambient: "B"
    }
};
