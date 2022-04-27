const BaseController = require('../src').BaseController;

class HomeController extends BaseController {
    async index() {
        console.log('HomeController#index called from the controller');
        return {
            msg: 'HomeController#index called from the controller'
        }
    }
}

module.exports = HomeController;