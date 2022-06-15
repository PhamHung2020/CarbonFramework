const BaseController = require('../src').BaseController;
const CustomError = require('../src').CustomError;
const { throws } = require('assert');
const { log } = require('console');
const pool = require('../db');
const pm = require('../models/Post');

class PostsController extends BaseController {
    async index() {
        // console.log('PostController#index called from the controller');
        // const [rows, fields] = await pool.query("SELECT * FROM POST");
        // return this.ok({
        //     msg: 'PostController#index called from the controller',
        //     rows,
        // });
        const [rows, fields] = await pm.get()
        console.log(rows);
    }

    // this.params, this.query, this.body
    async show() {
        // console.log('PostController#show called from the controller');
        // const [rows] = await pool.query("SELECT * FROM POST WHERE ID = ?", this.params.id);
        
        console.log(`Post id: ${this.params.id}`);
        if(!Number.isInteger(Number(this.params.id)))
            throw new CustomError.BadRequestError("Invalid id");
        const rows = await pm.getSingle(this.params.id);
        if (rows.length == 0) {
            // return this.badRequest({
            //     msg: "Post not found"
            // });
            throw new CustomError.NotFoundError("Post not found");
        }
        return this.ok({
            msg: 'get single called from model',
            rows
        });
    }

    async create() {
        console.log(this.body);
        const post = await pm.create(this.body)
        if(!post)
            throw new CustomError.BadRequestError("Cant insert")
        return {
            msg: 'create() called model',
            post
        }
    }
}

module.exports = PostsController