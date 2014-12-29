var config = {};
config.cloudant = {};
config.cloudant.dbName = 'noteable';


config.cloudant.host = process.env.cloudantHost;
config.cloudant.port = process.env.cloudantPort;
config.cloudant.user = process.env.cloudantUsername;
config.cloudant.password = process.env.cloudantPassword;
config.cloudant.url = process.env.cloudantURL;

config.admin_user = 'minhtri';
config.admin_password = 'pham';
config.index_field = 'username';


module.exports = config;