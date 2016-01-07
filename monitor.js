/**
 * Created by mmspaeth on 07.12.15.
 */

var monitorPort = process.argv[2];
var baudRate = isNaN(process.argv[3]) ? 9600 : process.argv[3];
var listen = isNaN(process.argv[4]) ? 3000 : process.argv[4];
var verbose = process.argv[5] == "-v" ? true : false;

var serialPort = require("serialport");
var portFound = false;

var express = require('express');
var app = express();
var sendBuff = "";
var buffer = "";

var server = app.listen(listen, function () {
	var host = server.address().address;
	var port = server.address().port;
});

app.use(express.static(__dirname + '/public'));
app.get('/.*hart.*js$', function (req, res) {
	res.send('/.*hart.*js$');
});
app.get('/.*hart.*js$', function (req, res) {
	res.send('/.*hart.*js$');
})
app.get('/index.html', function (req, res) {
	res.set('Content-Type', 'text/html');
  	res.send('index.html');
});
app.get('/chartdata.txt', function (req, res) {
	res.set('Content-Type', 'text/plain');
  	res.send(sendBuff);
});

serialPort.list(function (err, ports) {
  var found = false;
  ports.forEach(function(port) {
  	if (port.comName == monitorPort) {
  		found = true;
	   	doLog("Found: " + port.comName, 1);
  	}
   	doLog(port.comName, 1);
  });
  if (!found) {
		doLog("No port '" + monitorPort + "' found! Exiting ...", 0);
  		process.exit();
  }
});

var SerialPort = require("serialport").SerialPort;
var port = new SerialPort(monitorPort, {
	baudrate: baudRate,
	parser: serialPort.parsers.readline("\n")
});

port.on('error', function(error) {
	doLog('failed to open: ' + error, 0);
});

var startPos = -1;
var endPos = -1;

port.on('data', function(data) {
	buffer += data + "\n";
	if (startPos == -1) {
		var nPos = buffer.indexOf("GRAPH-START");
		if (nPos >= 0) {
			startPos = nPos;
			doLog('Start found: START=' + startPos, 1);
		}
	}
	if (endPos == -1) {
		nPos = buffer.indexOf("GRAPH-END");
		if (nPos >= 0) {
			endPos = nPos;
			doLog('End found: END=' + endPos, 1);
			sendBuff = buffer.substr(startPos, endPos - startPos + 9) + "\n" + Math.floor(new Date().getTime() / 1000) + "\n";
			buffer = buffer.substr(endPos + 9);
			startPos = -1;
			endPos = -1;
		}
	}
	doLog('data received: ' + data, 1);
});

port.open(function (error) {
  	if (!error) {
  		doLog('open', 2);
	}
});

function doLog(msg, level) {
    if (level >= 1 && verbose) {
    	console.log(msg);
    } else if (level == 0) {
    	console.log(msg);
    }
}
