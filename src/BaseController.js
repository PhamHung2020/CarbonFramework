module.exports = class BaseController {
    constructor() {
        this._responseData = {
            statusCode: 200,
            contentType: 'application/json',
            headers: {},
            data: {},
            errors: {}
        };

        this._middlewares = [];
    }

    async run(action, data={}) {
        if (!this[action]) {
            this._responseData.statusCode = 404;
        }
        else {
            try {
                // params, query, body
                for (let d in data) {
                    this[d] = data[d];
                }
                const result = await this[action]();
                if (result) {
                    this._responseData.data = result;
                }
            }
            catch (err) {
                // this._responseData.statusCode = 500;
                // this._responseData.errors = {
                //     message: err.message,
                //     stack: err.stack,
                // };
                throw err;
            }
        }
    }

    ok(resource) {
        this._responseData.statusCode = 200;
        return resource;
    }

    created(createdResource, url) {
        this._responseData.statusCode = 201;
        this._responseData.headers["Location"] = url;
        return createdResource;
    }

    noContent() {
        this._responseData.statusCode = 204;
        return {};
    }

    notFound(message) {
        this._responseData.statusCode = 404;
        return message;
    }

    badRequest(message) {
        this._responseData.statusCode = 400;
        return message;
    }

    conflict(message) {
        this._responseData.statusCode = 409;
        return message;
    }

    forbid() {
        this._responseData.statusCode = 403;
        return {};
    }

    unauthorized() {
        this._responseData.statusCode = 401;
        return {};
    }



    redirectTo(path) {
        this._responseData = {
            statusCode: 301,
            contentType: '',
            params: {
                Location: path
            }
        }
    }
    
    // converts a controller as PostsController into posts
    _controllerPath() {
        return this.constructor.name.replace('Controller', '').toLowerCase();
    }

};
