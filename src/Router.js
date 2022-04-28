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

    get(path, resolve, middlewares=[]) {
        if (!this.routes["GET"][path]) {
            this.routes["GET"][path] = {
                middlewares,
                resolve
            };
        }
    }

    post(path, resolve, middlewares=[]) {
        if (!this.routes["POST"][path]) {
            this.routes["POST"][path] = {
                middlewares,
                resolve
            };
        }
    }

    put(path, resolve, middlewares=[]) {
        if (!this.routes["PUT"][path]) {
            this.routes["PUT"][path] = {
                middlewares,
                resolve
            };
        }
    }

    delete(path, resolve, middlewares=[]) {
        if (!this.routes["DELETE"][path]) {
            this.routes["DELETE"][path] = {
                middlewares,
                resolve
            };
        }
    }

    /* this.routes = {
        "GET": {
            "post": {
                "resolve": "PostController#index",
                "middleware": [.....]
            }
            "post/:id": "PostController#show"    path: post/5 => params: { id: 5}
        },
        "POST": {
            ...
        }
    }
    */
    resolve(method, path) {
        console.log(this.routes[method]);
        const routes = this.routes[method];
        for (let routePath in routes) {
            const matcher = match(routePath, { decode: decodeURIComponent});
            let result = matcher(path);
            let route = routes[routePath];
            if (result) {
                const resolve = route.resolve.split('#');
                return {
                    controller: resolve[0],
                    action: resolve[1],
                    params: result.params,
                    middlewares: route.middlewares
                }
            }
        }
        return null;
    }
}

module.exports = new Router();