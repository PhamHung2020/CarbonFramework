const Model = require('../src/ModelBase');

const db = require("../db");
const { title } = require('process');

class Post extends Model.Base {
    setup() {
        this.setAttribute("title", Model.Attributes.String);
        this.setAttribute("content", Model.Attributes.String);

        this.validate("title", Model.Validators.PresenceOf);
    }

    async get() {
        console.log('Get() called from the model');
        const [rows, fields] = await db.query("SELECT * FROM POST");
        return [rows, fields]
    }

    async getSingle(id) {
        console.log('Get single called from the model');
        const [rows] = await db.query("SELECT * FROM POST WHERE id = ?", id)
        return rows;
    }

    async create(body) {
        console.log('Create() called from the model')
        const post = await db.query("INSERT INTO post(tittle, content) VALUES (?, ?)"
                                    , [body.title, body.content])

        return post
    }
}



module.exports = new Post();