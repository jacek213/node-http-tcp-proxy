var file = process.argv[2] || '/etc/flashpolicy.xml',
    host = process.argv[3] || 'localhost',
    port = process.argv[4] || 8484,
    poli = 'flash policy data\n',
    net  = require('net'),
    http = require('http');

var fsps = net.createServer(function (stream) {
    stream.setEncoding('utf8');
    // stream.setTimeout(10000); // 10s
    stream.on('connect', function () {
        console.log('Got connection from ' + stream.remoteAddress + '.');
    });
    stream.on('data', function (data) {
        var test = /^<policy-file-request\/>/;
        if (test.test(data)) {
            console.log('Good request. Sending file to ' + stream.remoteAddress + '.')
            stream.end(poli + '\0');
        } else {
            console.log('Not a policy file request ' + stream.remoteAddress + '.');

            var serviceSocket = new net.Socket();
            serviceSocket.connect(3000, 'localhost', function () {
                console.log('>>>> Data from 8484 to 3000 >>>>\n', data.toString());
                serviceSocket.write(data);
            });
            serviceSocket.on("data", function (received_data) {
                console.log('<<<< Data from 3000 to 8484 to client <<<<\n', received_data.toString());
                stream.write(received_data);
            });
        }
    });
    stream.on('end', function () {
        console.log('tcp server disconnected');
    });
    stream.on('timeout', function () {
        console.log('Request from ' + stream.remoteAddress + ' timed out.');
    });
});

require('fs').readFile(file, 'utf8', function (err, poli) {
    if (err) throw err;
    fsps.listen(port, host);
    console.log('Flash socket policy server running at ' + host + ':' + port + ' and serving ' + file);
});
