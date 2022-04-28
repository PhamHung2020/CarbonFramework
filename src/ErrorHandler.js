//const { CustomAPIError } = require('./errors');

const errorHandler = (req, res, next, err) => {
    let customError = {
      // set default
      statusCode: err.statusCode || 500,
      msg: err.message || 'Something went wrong try again later',
    }   
    // if (err instanceof CustomAPIError) {
    //   return res.status(err.statusCode).json({ msg: err.message })
    // }   
    res.statusCode = customError.statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        msg: customError.msg
    }));
    //return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandler