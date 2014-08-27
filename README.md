Home Ambient/Climate Tracking
====================

Tracker for home ambient (light, sound, humidity and temperature) using tessel.io.

You can use it by doing:

```
$ git clone https://github.com/Reportr/tracker-home-ambient.git
$ cd tracker-home-ambient
$ npm install
```

Then edit the file `config.js` to adapt to your configuration (ports, auth, host, ...).

Then deployed using (after following instructions at [start.tessel.io](http://start.tessel.io/install):

```
$ tessel run ambient.js
```
