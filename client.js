
var http = require('http');
var tls = require('tls');
var crypto = require('crypto');
var fs = require('fs');

var key = fs.readFileSync('./server.key');
var cert = fs.readFileSync('./server.crt');

// make a request
var options = {
    port: 80,
    host: 'jeansebtr.upgrade.jit.su',
    headers: {
        'Connection': 'Upgrade',
        'Upgrade': 'websocket'
    }
};

var req = http.request(options);
req.end();

req.on('upgrade', function(res, socket, upgradeHead) {
    console.log('got upgraded!');

    var pair = tls.createSecurePair(crypto.createCredentials({
      key: key,
      cert: cert
    }), false, false);
    // ...
    socket.pipe(pair.encrypted);
    pair.encrypted.pipe(socket);

    pair.cleartext.pipe(process.stdout);
    process.stdin.pipe(pair.cleartext);
    process.stdin.resume();
    pair.on('secure', function() {
      console.log('-> Dude that works!');
    });
});

req.on('error', function(err) {
    console.error('WTF:', err);
    console.error(err.stack);
});
