// Import the spawn function defined on child_process module
var spawn = require('child_process').spawn;
// Launch a child process with a “tail -f /var/log/system.log” command
var child = spawn('tail', ['-f', '/var/log/system.log']);