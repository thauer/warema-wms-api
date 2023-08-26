
const { SerialPort } = require('serialport');

const WmsVbStick = require("../../warema-wms-api");

test.only("Verify that testing works", () => {
    expect("hello").toBe("hello");
});

test("SerialPort should be available", () => {
    port = new SerialPort( { path: "/dev/ttyUSB0" , baudRate: 125000 })
    port.close(error => {
        expect(error).toBeDefined()
        expect(error.message).toBe("Port is not open")
    })
})

test.only("SerialPort open and close", () => {
    port = new SerialPort( { path: "/dev/ttyUSB0" , baudRate: 125000 })
    port.on('open', ()=>{ expect(port.isOpen)})
    setTimeout( () => { 
        expect(port.isOpen);
        port.close();
        expect(!port.isOpen);
    }, 200 );
})

test("stick", () => {
    expect(1).toBe(1);
    console.log("hi");

    function callback( err, msg ){ }
    
    var wms_channel = 17
    var wms_panid = "D2BD"
    var wms_key = "1F29066087C70C9A9EF592F6A21444BE"
    
    stick = new WmsVbStick( "/dev/ttyUSB0", wms_channel, wms_panid, wms_key, {}, callback );

});
