
var http = require('http');
var tls = require('tls');
var crypto = require('crypto');
var fs = require('fs');

var key = fs.readFileSync('./server.key');
var cert = fs.readFileSync('./server.crt');

// Create an HTTP server
var srv = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');
});
srv.on('upgrade', function(req, socket, head) {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  console.log('Got an upgrade request!');
  var pair = tls.createSecurePair(crypto.createCredentials({
      key: key,
      cert: cert
  }), true, false);
  // echo back
  socket.pipe(pair.encrypted);
  pair.encrypted.pipe(socket);
  pair.cleartext.pipe(pair.cleartext);
  pair.on('secure', function() {
      console.log('Dude that works!');
  });
});

// now that server is running
srv.listen(process.env.PORT, function() {
    console.log('server started on port %d', srv.address().port);
});
