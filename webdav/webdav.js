"use strict";
var jsDAV = require("jsDAV/lib/jsdav");
// setting debugMode to TRUE outputs a LOT of information to console
jsDAV.debugMode = false;

var jsDAV_Locks_Backend_FS  = require("jsDAV/lib/DAV/plugins/locks/fs");
var jsDAV_Auth_Backend_File = require("jsDAV/lib/DAV/plugins/auth/file");


// Auth notes
// Must run cmd to truncate newlines from auth file... doesnt work otherwise
// perl -i -pe "chomp if eof" ./htdigest
// I will probably fork jsDAV to add Cloudant Auth

jsDAV.createServer({
    node: __dirname + "/data",
    locksBackend: jsDAV_Locks_Backend_FS.new(__dirname + "/data"),
    authBackend:  jsDAV_Auth_Backend_File.new(__dirname + "/htdigest"),
    realm: "noteable"
}, process.env.WEBDAV_PORT || 8000);
