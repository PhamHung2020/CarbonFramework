const BaseController = require('../src').BaseController;
const CustomError = require('../src').CustomError;
const pool = require('../db');

class PostsController extends BaseController {
    async index() {
        console.log('PostController#index called from the controller');
        const [rows, fields] = await pool.query("SELECT * FROM POST");
        return this.ok({
            msg: 'PostController#index called from the controller',
            rows,
        });
    }

    // this.params, this.query, this.body
    async show() {
        console.log('PostController#show called from the controller');
        const [rows] = await pool.query("SELECT * FROM POST WHERE ID = ?", this.params.id);
        if (rows.length == 0) {
            // return this.badRequest({
            //     msg: "Post not found"
            // });
            throw new CustomError.NotFoundError("Post not found");
        }
        return this.ok({
            msg: 'PostController#show called from the controller',
            rows
        });
    }

    async create() {
        console.log(this.body);
        return {
            msg: 'PostController#create called from the controller'
        }
    }
}

module.exports = PostsController