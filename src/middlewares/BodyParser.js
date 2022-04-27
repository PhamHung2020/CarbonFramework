const { StringDecoder } = require('string_decoder');

const BodyParser = (req, res, next) => {
    const decoder = new StringDecoder('utf-8');
    let payload = '';
    if (!req.controller.data.params) {
        req.controller.data.params = {};
    }

    req.on('data', (data) => {
        payload += decoder.write(data);
    });

    req.on('end', () => {
        payload += decoder.end();
        //console.log('payload');
        //console.log(payload);
        if (req.headers['content-type'] === "application/json")
            req.controller.data.body = {...req.controller.data.body, ...JSON.parse(payload)}
        next();
    });
}

module.exports = BodyParser;