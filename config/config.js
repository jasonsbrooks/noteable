var config = {};
config.cloudant = {};
config.cloudant.dbName = 'noteable';

if (app.get('env') === 'development') {
    config.cloudant.host = process.env.cloudantHost;
    config.cloudant.port = process.env.cloudantPort;
    config.cloudant.user = process.env.cloudantUsername;
    config.cloudant.password = process.env.cloudantPassword;
    config.cloudant.url = process.env.cloudantURL;
} else {
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
}

module.exports = config;