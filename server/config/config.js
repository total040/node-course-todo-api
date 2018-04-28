var env = process.env.NODE_ENV || 'development';
console.log('env**** ', env);

if (env === 'development' || env === 'test') {
    var config = require('./config.json');
    var envObj = config[env];
    Object.keys(envObj).forEach(function (key) {
        process.env[key] = envObj[key];
    });
}