const util = require('util');
const { createLogger, format, transports } = require('winston');
const logger = createLogger({
  level: 'debug',
  format: format.simple(),
  transports: [ new transports.Console() ],
});

const { SerialPort } = require('serialport');
const { DelimiterParser }  = require('@serialport/parser-delimiter')
const DelimiterChar = '}';

port = new SerialPort( { path: "/dev/ttyUSB0" , baudRate: 125000 });
parser = port.pipe(new DelimiterParser({ delimiter: DelimiterChar }));

parser.on('data', (data) => {
    received = data.toString('utf8') + DelimiterChar;
    logger.debug("RCV " + received);

    matched = received.match(/{g(?<name>.+)}/);              // '{gWMS USB-Stick}'
    if(matched !== null) {
        logger.debug("response[G]: " + matched.groups.name);
        return;
    }

    matched = received.match(/{v(?<version>.+)}/);           // '{v...}'
    if(matched !== null) {
        logger.debug("response[V]: " + matched.groups.version);
        return;
    }

    matched = received.match(/{a}/);                         // '{a}'
    if(matched !== null) {
        logger.debug("response: ACK");
        return;
    }
    // 01 234567 8901 23 45 67 890123 45 67 89 01 
    // {r SNR    7080 ?? WI LU ?????? ?? ?? RA TE
    
    matched = received.match(
        /{r(?<snr>.{6})7080..(?<wind>..)(?<illuminance>..).{10}(?<rain>..)(?<temperature>..).+}/
    )
    if(matched !== null ) {
        logger.debug(util.format("response: WBCAST( wind: %s, illuminance: %s, rain: %s, temperature: %s)", 
                                 matched.groups.wind, matched.groups.illuminance, matched.groups.rain, matched.groups.temperature));
        return;
    }
});

function send(stringToSend) {
    logger.debug("SND " + stringToSend);
    port.write(stringToSend);
}

port.on('open', () => {
    setTimeout( () => { send("{G}")  }, 50);
    setTimeout( () => { send("{V}")  }, 100);
    setTimeout( () => { send("{K4011F29066087C70C9A9EF592F6A21444BE}")  }, 150);
    setTimeout( () => { send("{M%17D2BD}")}, 200);
})

setTimeout( () => {
    logger.info("Closing port");
    port.close();
}, 2000 );