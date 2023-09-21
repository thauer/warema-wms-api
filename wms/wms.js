const WmsVbStick = require("../lib");
const log = require( "../lib/wms-vb-logger.js" );


log.addLogFile( "console", "D", ""/*fileWrap*/, "MSm"/*tsFormat*/,["weatherBroadcast", "A18513", "968513", "678513", "9B8513"]/*filterArray*/ );
//~ log.removeLogFile( "console" );
log.addLogFile( "/home/pi/test.log", "D", "H"/*fileWrap*/, "YMDHMSm l"/*tsFormat*/, []/*filterArray*/ );
log.addLogFile( "/home/pi/testdaily.log", "D", "D"/*fileWrap*/, "YMDHMSm l"/*tsFormat*/, []); //["g", "fo", "Tr"]/*filterArray*/ );

weather = {}

function callback( err, msg ){
    if( err ){ 
      console.log( "Callback err: " + err ); 
      return;
    }
    switch( msg.topic ) {
      case "wms-vb-init-completion" : 
        stick.setPosUpdInterval( 0 );
        // stick.setPosUpdInterval( 30000 );
        break;
      case "wms-vb-rcv-weather-broadcast":
        w = msg.payload.weather
        if(false) {
          console.log(`${w.snr}: ${w.illuminance.toString().padStart(8)}lm `+
                      `${w.temperature.toFixed(1)}°C ${w.wind} rain: ${w.rain ? "yes" : "no"}`)
        }
  
        side = {1279382: "12793(82)", 1279335: "12793(35)", 1279387: "12793(87)", 1279393: "West(93)"}
        weather[side[w.snr]] = {'illuminance': w.illuminance, 'temperature': w.temperature, 'wind': w.wind, 'rain': w.rain}
  
        break;
      case "wms-vb-blind-position-update":
        p = msg.payload
        console.log(`Callback: ${p.name}: `
          + `pos:${p.position} ang:${p.angle} moving: ${p.moving}`)
        break
      case "wms-vb-scanned-devices":
      case "wms-vb-cmd-result-set-position":
      case "wms-vb-cmd-result-stop":
      default:
        console.log( "Callback msg: " + JSON.stringify( msg ) );
    }
}


console.log( "starting ..." );

var wms_channel = 17
var wms_panid = "D2BD"
var wms_key = "1F29066087C70C9A9EF592F6A21444BE"

stick = new WmsVbStick( "/dev/ttyUSB0", wms_channel, wms_panid, wms_key, {}, callback );

console.log( "finished." );

stick.vnBlindAdd(1260043, "Ben"    )
stick.vnBlindAdd(1187205, "Lilla"  )
stick.vnBlindAdd(1190506, "Bedroom")
stick.vnBlindAdd(1190504, "E1" )
stick.vnBlindAdd(1190503, "E2" )
stick.vnBlindAdd(1260229, "S1" )
stick.vnBlindAdd(1259963, "S2" )
stick.vnBlindAdd(1268208, "S3" )
stick.vnBlindAdd( 883045, "S4" )
stick.vnBlindAdd(1190496, "S5" )
stick.vnBlindAdd(1190454, "S6" )
stick.vnBlindAdd(1259545, "W1" )

stick.vnBlindAdd(1247705, "Awning");
stick.vnBlindAdd(1247909, "Awning West");


blinds = stick.vnBlindsList()

livingroom = ["E1", "E2", "S1", "S2", "S3", "S4", "S5", "S6", "W1"]
east = ["E1", "E2", "Ben", "Lilla"]
west = ["W1", "S5", "Bedroom"]
south = ["S1", "S2", "S3", "S4", "S6"]

// stick.vnBlindGetPosition("E1")
// stick.vnBlindSetPosition("W1", 100, 0)

/* position: percent from 0 to 100. 
       At 0 (open) set angle to -100 to retract into the cover.
angle: -100: the slats are completely inclined inwards. 
          0: the slats are in horizontal position. 
        100: the slats are completely inclined outwards.
*/
function setBlinds(blinds, position, angle ) {
  for (const blind of blinds) {
    stick.vnBlindSetPosition(blind, position, angle)
  }
}

function lower( blinds ) {
  setBlinds(blinds, 100, 0)
}

function raise( blinds ) {
  setBlinds(blinds, 0, -100)
}

module.exports = { lower, raise };

stick.vnBlindSetPosition("E1", 66, 0)

setTimeout( function() { stick.close(); }, 3000 );
