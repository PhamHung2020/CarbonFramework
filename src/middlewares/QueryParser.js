const QueryParser = (req, res, next) => {
    const urlSplit = req.url.split('?');
    const pathname = urlSplit[0];
    const queryString = urlSplit[1];

    // get query string object
    const urlSearchParams = new URLSearchParams(queryString);
    const query = {};
    for (let key of urlSearchParams.keys()) {
        query[key] = urlSearchParams.get(key);
    }

    req.controller.data.query = {...req.controller.data.query, ...query};
    req.controller.data.path = pathname;
    next();
}

module.exports = QueryParser;