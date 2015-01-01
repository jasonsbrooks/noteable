"use strict";

module.exports = {
    cloudant: {
        dbName:   'noteable',
        host:     process.env.CLOUDANT_HOST,
        port:     process.env.CLOUDANT_PORT,
        user:     process.env.CLOUDANT_USERNAME,
        password: process.env.CLOUDANT_PASSWORD,
        url:      process.env.CLOUDANT_URL
    }
};
