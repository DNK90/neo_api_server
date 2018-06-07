let dev = require('./config/dev');
let docker = require('./config/docker');


exports.load_env = function () {

    console.log("IS RUNNING ON DOCKER: " + process.env.DOCKER);

    if (process.env.DOCKER)
        return docker;

    return dev;
};
