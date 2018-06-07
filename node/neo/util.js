let dev = require('./config/dev');
let docker = require('./config/docker');


exports.load_env = function () {

    if (process.env.DOCKER)
        return docker;

    return dev;
};
