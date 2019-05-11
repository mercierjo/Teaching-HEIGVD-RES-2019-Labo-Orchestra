const dgram = require('dgram');
const moment = require('moment');
var net = require('net');
var musicianMap = new Map();

const s = dgram.createSocket('udp4');
s.bind(2206, function() {
    s.addMembership("239.255.255.10");
});

s.on('message', function(msg, source) {
    var infos = JSON.parse(msg);
    var now = moment().format();
    var musician = {
        uuid: infos.uuid,
        instrument: infos.instrument,
        activeSince: now,
    }

    console.log("Musician: " + JSON.stringify(musician));
    musicianMap.set(infos.uuid, musician);
});

function controlMusician() {
    musicianMap.forEach(function(musician, uuid) {
        if(moment(Date.now()) > moment(musician.activeSince).add(5,'s')) {
            musicianMap.delete(uuid);
        }
    });
}

setInterval(controlMusician, 500);

var serverTcp = net.createServer();
serverTcp.on('connection', function(socket){
    var musicians = new Array();
    musicianMap.forEach(function(musician, uuid) {
        musicians.push(musician);
    });

    socket.write(JSON.stringify(musicians));
    socket.end();
})

serverTcp.listen(2205);
