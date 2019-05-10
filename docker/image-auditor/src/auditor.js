const dgram = require('dgram');
const moment = require('moment');
var net = require('net');
var musicianMap = new Map();

const s = dgram.createSocket('udp4');
s.bind(2206, function() {
    s.addMembership("229.255.255.10");
});

s.on('message', function(msg, source) {
    var infos = JSON.parse(msg);
    var now = moment().format();
    var musician = {
        uuid: infos.uuid,
        instrument: infos.instrument,
        activeSince: now,
    }
    musicianMap.set(infos.uuid, musician);
});

function controlMusician() {
    var now = moment().format();

    musicianMap.forEach(function(musician, uuid) {
        if(now == moment(musician.activeSince).add(5,'s')) {
            musicianMap.delete(uuid);
        }
    });
}

setInterval(controlMusician, 500);

var serverTcp = net.createServer(function(socket) {
    var musicians = new Array();
    musicianMap.forEach(function(musician, uuid) {
        musicians.add(musician);
    });

    socket.write(JSON.stringify(musicians));
    socket.pipe(socket);
});

serverTcp.listen(2205,'127.0.0.1');
serverTcp.close();