var spawn = require("child_process").spawn;
var path = require("path");

var common = require("../../../common");
var logger = new common.Formatter("weinre");

var _child = null;

function kill(cb) {
	if (_child) {
		_child.on('exit', function (code) {
			if (cb) cb();
		});

		setTimeout(function () {
			if (_child) {
				//logger.log("[weinre]", "weinre sent SIGKILL");
				_child.kill('SIGKILL');
			}
		}, 5000);

		//console.log('(weinre sent SIGTERM)');
		_child.kill('SIGTERM');
	} else {
		if (cb) cb();
	}
}

process.on('exit', function () { kill(); });

exports.load = function (app) {
	//grab the path of the inspector
	var weinre = path.join(common.paths.root(), "./node_modules/.bin/weinre");

	kill();

	_child = spawn(weinre, ["--boundHost", "0.0.0.0", "--httpPort", "9223"], {cwd: common.paths.root()});

	_child.on('exit', function(code) {
		_child = null;
		if (code) {
			logger.log("weinre exited with code " + code);
		}
	});
};
