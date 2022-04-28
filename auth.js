const auth = (req, res, next) => {
    console.log('Auth middleware called');
    throw new Error("Some auth error");
    next();
}

module.exports = auth;