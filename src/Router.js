const {match} = require('path-to-regexp');

class Router {
    constructor() {
        this.routes = {
            "GET": {},
            "POST": {},
            "PUT": {},
            "PATCH": {},
            "DELETE": {},
        };
    }

    get(path, resovle, middlewares=[]) {
        if (!this.routes["GET"][path]) {
            this.routes["GET"][path] = resovle;
        }
    }

    post(path, resovle, middlewares=[]) {
        if (!this.routes["POST"][path]) {
            this.routes["POST"][path] = resovle;
        }
    }

    put(path, resovle, middlewares=[]) {
        if (!this.routes["PUT"][path]) {
            this.routes["PUT"][path] = resovle;
        }
    }

    delete(path, resovle, middlewares=[]) {
        if (!this.routes["DELETE"][path]) {
            this.routes["DELETE"][path] = resovle;
        }
    }

    /* this.routes = {
        "GET": {
            "post": "PostController#index",
            "post/:id": "PostController#show"    path: post/5 => params: { id: 5}
        },
        "POST": {
            ...
        }
    }
    */
    resolve(method, path) {
        const routes = this.routes[method];
        for (let routePath in routes) {
            let route = routes[routePath];
            const matcher = match(routePath, { decode: decodeURIComponent});
            let result = matcher(path);
            if (result) {
                route = route.split('#');
                console.log(result);
                return {
                    controller: route[0],
                    action: route[1],
                    params: result.params,
                }
            }
        }
        return null;
    }
}

module.exports = new Router();