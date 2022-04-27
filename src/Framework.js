const http = require('http');
const fs = require('fs');
//const nodeStatic = require('node-static');
const BodyParser = require('./middlewares/BodyParser');
const QueryParser = require('./middlewares/QueryParser');

class Framework {
    constructor(router, controllersPath="controllers/") {
        this._http = http;
        this._router = router;
        //this._static = new nodeStatic.Server('../public');

        // framework data
        this._controllers = [];
        this._controllersPath = controllersPath;
        this._middlewares = [BodyParser, QueryParser];
        this._staticRoutes = [];

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

            // if (this._staticRoutes.includes(req.url.split('/')[1])) {
            //     req.addListener("end", () => {
            //         this._static.serve(req, res);
            //     }).resume();
            // }
            // else {
            //     // process middlewares
            //     this._processMiddlewares(req, res);
            // }
            this._processMiddlewares(req, res);
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

    // static(staticRoutes) {
    //     this._staticRoutes = staticRoutes;
    // }

    // PRIVATE METHODS
    _processMiddlewares(req, res) {
        const stack = this._middlewares;
        let index = 0, layer;
        const handleMiddlewares = () => {
            const next = () => {
                layer = stack[index++];
                if (!layer) {
                    this._resolveResponse(req, res);
                    return;
                }
                layer(req, res, next);
            }
            // start
            next();
        }
        handleMiddlewares();
    }

    async _resolveResponse(req, res) {
        const requestTime = new Date().getTime();
        const resolveData = this._router.resolve(req.method, req.controller.data.path);

        if (resolveData == null) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                msg: "Route does not exist"
            }));
        }
        else {
            this.logger.info(`Request processing ${resolveData.controller}#${resolveData.action}`);
            
            const controller = new this._controllers[resolveData.controller]();
            req.controller.data.params = {...req.controller.data.params, ...resolveData.params};
            
            await controller.run(resolveData.action, req.controller.data); // data: params, query, body

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

        let elapsedTime = (new Date().getTime() - requestTime) / 1000.0;
        this.logger.info(`Request finished in ${elapsedTime} seconds`);
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