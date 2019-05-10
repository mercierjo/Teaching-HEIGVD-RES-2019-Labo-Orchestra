const dgram = require('dgram');

const s = dgram.createSocket('udp4');


function Musician(uuid, instrument) {
    this.uuid = uuid;
    this.instrument = instrument;

    Musician.prototype.update = function() {
        var infos = {
            uuid: this.uuid,
            instrument: this.instrument,
        };

        switch(this.instrument) {
            case "piano": infos.sound = "ti-ta-ti";
                break;
            case "trumpet": infos.sound = "pouet";
                break;
            case "flute": infos.sound = "trulu";
                break;
            case "violin": infos.sound = "gzi-gzi";
                break;
            case "drum": infos.sound = "boum-boum";
                break;
            default: infos.sound = "nothing";
                break;
        }

        var payload = JSON.stringify(infos);

        message = new Buffer(payload);

        s.send(message, 0, message.length, 2206, "239.255.255.10", function(err, bytes) {
            console.log("Sending payload: " + payload + " via port " + s.address().port);
        });
    }

    setInterval(this.update.bind(this), 1000);
}

const uuid = require('uuid/v4');
var instrument = process.argv[2];

var m1 = new Musician(uuid(), instrument);