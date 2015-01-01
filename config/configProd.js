var config = {};
config.cloudant = {};
config.cloudant.dbName = 'noteable';
config.admin_user = 'minhtri';
config.admin_password = 'pham';
config.admin_email = 'minhtri@pham.cz';
config.index_fields = ['username', 'email', 'doc_id'];


if(process.env.VCAP_SERVICES) {
    var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
    if(vcapServices.cloudantNoSQLDB) {
        config.cloudant.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
        config.cloudant.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
        config.cloudant.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
        config.cloudant.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
        config.cloudant.url = vcapServices.cloudantNoSQLDB[0].credentials.url;
    }
    console.log('VCAP Services: '+JSON.stringify(process.env.VCAP_SERVICES));
}


module.exports = config;