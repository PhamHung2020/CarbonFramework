const http = require('http');
const fs = require('fs');
//const nodeStatic = require('node-static');
const BodyParser = require('./middlewares/BodyParser');
const QueryParser = require('./middlewares/QueryParser');
const ErrorHandler = require('./ErrorHandler');

class Framework {
    constructor(router, controllersPath="controllers/") {
        this._http = http;
        this._router = router;
        this._controllersPath = controllersPath;
        //this._static = new nodeStatic.Server('../public');

        // framework data
        this._controllers = [];
        this._middlewares = [BodyParser, QueryParser];
        //this._staticRoutes = [];
        //this._errorHandlers = [];

        // helpers
        this.logger = {
            info: (msg) => console.log(`INFO - ${msg}`),
            error: (msg) => console.log(`ERROR - ${msg}`),
            debug: (msg) => console.log(`DEBUG - ${msg}`),
            log: (msg) => console.log(msg),
        };
    }

    // PUBLIC METHODS

    async listen(port = 3000, hostname = 'localhost', callback) {
        this._controllers = this._autoLoad(this._controllersPath);

        const server = this._http.createServer(async (req, res) => {
            this.logger.info(`${req.method} - ${req.url}`);
            req.setEncoding("utf-8");
            req.controller = { data: {} };
            try {
                // Execute global middlewares, 
                // then determine which controller (and local middlewares) to use
                this._processMiddlewares(req, res, this._middlewares, this._resolveResponse.bind(this));
            } catch (err) {
                // this._processMiddlewares(req, res, this._errorHandlers, this._defaultErrorHandler, err);
                ErrorHandler(req, res, null, err);
            }
        });

        if (!callback) 
            callback = () => {
                this.logger.info(`Server is running at http://${hostname}:${port}`);
            }

        if (typeof callback !== "function")
            throw new Error("Third argument of listen method must be a function");

        server.listen(port, hostname, callback);
    }

    useMiddleware(middleware) {
        this._middlewares.push(middleware);
    }

    useErrorHandler(errorHandler) {
        this._errorHandlers.push(errorHandler);
    }

    // static(staticRoutes) {
    //     this._staticRoutes = staticRoutes;
    // }

    // PRIVATE METHODS
    _processMiddlewares(req, res, middlewares, endFunc, err) {
        let index = 0, middleware;
        const handleMiddlewares = () => {
            const next = () => {
                middleware = middlewares[index++];
                if (!middleware) {
                    try {
                        endFunc(req, res, err);
                    } catch (err) {
                        console.log("Error 3");
                        throw err;
                    }
                    return;
                }
                try {
                    middleware(req, res, next, err);
                } catch (err) {
                    throw err;
                }
            }
            // start
            try {
                next();
            } catch (err) {
                console.log("Error 4");
                throw err;
            }
        }
        handleMiddlewares();
    }

    async _resolveResponse(req, res) {
        const requestTime = new Date().getTime();
        // Get name of controller, action, local middlewares
        const resolveData = req.resolveData = this._router.resolve(req.method, req.controller.data.path);

        if (resolveData == null) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                msg: "Route does not exist"
            }));
        }
        else {
            this.logger.info(`Request processing ${resolveData.controller}#${resolveData.action}`);
            try{
                // Execute local middlewares,
                // then run controller
                this._processMiddlewares(req, res, resolveData.middlewares, this._evokeController.bind(this));
            } catch (err) {
                console.log("Error 2");
                throw err;
            }
        }

        let elapsedTime = (new Date().getTime() - requestTime) / 1000.0;
        this.logger.info(`Request finished in ${elapsedTime} seconds`);
    }

    async _evokeController(req, res) {
        const resolveData = req.resolveData;
        const controller = new this._controllers[resolveData.controller]();
        req.controller.data.params = {...req.controller.data.params, ...resolveData.params};
        try {
            await controller.run(resolveData.action, req.controller.data); // data: params, query, body
        } catch (err) {
            console.log("Error 1");
            throw err;
        }
        switch (controller._responseData.statusCode) {
            case 301:
                res.writeHead(301, controller._responseData.headers);
                res.end();
                break;
            
            case 500:
                res.statusCode = 500;
                res.setHeader('Content-Type', controller._responseData.contentType);
                res.end(JSON.stringify({
                    msg: controller._responseData.errors,
                }));
            
            default:
                res.statusCode = controller._responseData.statusCode;
                res.setHeader('Content-Type', controller._responseData.contentType);
                res.end(JSON.stringify(controller._responseData.data));
        }
    }

    _defaultErrorHandler(req, res, err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            err
        }));
    }

    _autoLoad(folder) {
        let files = {};
        fs.readdirSync(`./${folder}`).forEach((file) => {
            let _require = require(`../${folder}${file}`);
            files[file.replace('.js', '')] = _require;
        });
        return files;
    }
}

module.exports = Framework;