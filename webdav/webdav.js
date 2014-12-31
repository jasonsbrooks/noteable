
var jsDAV = require("jsDAV/lib/jsdav");
// setting debugMode to TRUE outputs a LOT of information to console
//jsDAV.debugMode = true;
var jsDAV_Locks_Backend_FS = require("jsDAV/lib/DAV/plugins/locks/fs");

jsDAV.createServer({
    node: __dirname + "/assets",
    locksBackend: jsDAV_Locks_Backend_FS.new(__dirname + "/data")
}, 8000);
