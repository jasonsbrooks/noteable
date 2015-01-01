var config = {};
config.cloudant = {};
config.cloudant.dbName = 'noteable';


config.cloudant.host = process.env.CLOUDANT_HOST;
config.cloudant.port = process.env.CLOUDANT_PORT;
config.cloudant.user = process.env.CLOUDANT_USERNAME;
config.cloudant.password = process.env.CLOUDANT_PASSWORD;
config.cloudant.url = process.env.CLOUDANT_URL;

config.admin_user = 'minhtri';
config.admin_password = 'pham';
config.index_fields = ['username', 'email'];
config.admin_email = 'minhtri@pham.cz';

module.exports = config;