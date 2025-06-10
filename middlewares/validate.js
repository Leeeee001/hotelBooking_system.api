const validate = (schema) => (req, res, next) => {          // validate the request body against the auth validation
    try {
        req.body = schema.parse(req.body)
        next()
    } catch (err) {
        return res.status(400).json({
            status: 400,
            error: err.message || "Not Validate"
        })
    }
};

module.exports = validate;
