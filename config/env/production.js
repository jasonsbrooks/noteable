"use strict";

var vcapServices = JSON.parse(process.env.VCAP_SERVICES || '{}');
var services = vcapServices.cloudantNoSQLDB;

module.exports = {};

console.log('VCAP Services: \n'+JSON.stringify(process.env.VCAP_SERVICES, null, '  '));

if (services && services[0] && services[0].credentials) {
    var credentials = services[0].credentials;
    module.exports.cloudant = {
        port: credentials.port,
        host: credentials.host,
        user: credentials.username,
        password: credentials.password,
        url: credentials.url
    }
}
