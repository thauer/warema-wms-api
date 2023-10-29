
const { SerialPort } = require('serialport');
const { DelimiterParser }  = require('@serialport/parser-delimiter')
const DelimiterChar = '}';

const WmsVbStick = require("../../warema-wms-api");

test("Verify that testing works", () => {
    expect("hello").toBe("hello");
});

test("SerialPort should be available", () => {
    port = new SerialPort( { path: "/dev/ttyUSB0" , baudRate: 125000 })
    port.close(error => {
        expect(error).toBeDefined()
        expect(error.message).toBe("Port is not open")
    })
})

test("SerialPort can be opened, written to and closed", () => {
    port = new SerialPort( { path: "/dev/ttyUSB0" , baudRate: 125000 })
    port.on('open', ()=>{ 
        expect(port.isOpen)
    })
    setTimeout( () => { 
        expect(port.isOpen);
        var x = port.write("hello");
        expect(x).toBe(true);
    }, 200 );
    setTimeout( () => { 
        expect(port.isOpen);
        port.close();
        expect(!port.isOpen);
    }, 700 );
})

test("Command {G} returns stick name", done => {
    port = new SerialPort( { path: "/dev/ttyUSB0" , baudRate: 125000 });
    parser = port.pipe(new DelimiterParser({ delimiter: '}' }));

    received = ""

    parser.on('data', function (data) {
        received = received + data.toString('utf8') + '}';
    });

    port.on('open', () => { 
        port.write("{G}");
    })

    setTimeout( () => {
        expect(received).toMatch(/{gWMS USB-Stick}/);
        port.close();
        done();
    }, 200 );
});

test.skip("Command {V} returns stick version", done => {
    port = new SerialPort( { path: "/dev/ttyUSB0" , baudRate: 125000 });
    parser = port.pipe(new DelimiterParser({ delimiter: '}' }));

    received = ""
    parser.on('data', function (data) {
        received = received + data.toString('utf8') + '}';
    });

    port.on('open', () => { 
        port.write("{V}");
    })

    setTimeout( () => {
        expect(received).toMatch(/{v37605107   }/);
        port.close();
        done();
    }, 200 );
});

test.skip("Command {K} sets stick key and receives ACK", done => {
    port = new SerialPort( { path: "/dev/ttyUSB0" , baudRate: 125000 });
    parser = port.pipe(new DelimiterParser({ delimiter: '}' }));

    received = ""
    parser.on('data', function (data) {
        received = received + data.toString('utf8') + '}';
    });

    port.on('open', () => { 
        port.write('{K4011F29066087C70C9A9EF592F6A21444BE}');
    })

    setTimeout( () => {
        expect(received).toMatch(/{a}/);
        port.close();
        done();
    }, 200 );
});

test.skip("Command {M} sets stick channel and receives ACK", done => {
    port = new SerialPort( { path: "/dev/ttyUSB0" , baudRate: 125000 });
    parser = port.pipe(new DelimiterParser({ delimiter: '}' }));

    received = ""
    parser.on('data', function (data) {
        received = received + data.toString('utf8') + '}';
    });

    port.on('open', () => { 
        port.write("{M%" + "17" + "D2BD" + "}");
    })

    setTimeout( () => {
        expect(received).toMatch(/{a}/);
        port.close();
        done();
    }, 200 );
});
