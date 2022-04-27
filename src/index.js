const Framework = require('./Framework');
const Router = require('./Router');
const BaseController = require('./BaseController');
const fs = require('fs');

function createApplication(routePath="routes/", controllersPath="controllers/") {
    fs.readdirSync(routePath).forEach((file) => {
        require(`../${routePath}${file}`);
    });

    return new Framework(Router, controllersPath);
}

exports = module.exports = createApplication;
exports.Router = Router;
exports.BaseController = BaseController;