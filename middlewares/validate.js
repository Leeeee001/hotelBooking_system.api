const validate = (schema) => (req, res, next) => {   // check auth validation schemas from req
    const parsed = schema.safeParse(req.body);
    // console.log(parsed);
    if (!parsed.success) {
        console.log("Validation Error:", parsed.error.errors); 
        return res.status(400).json({ error: parsed.error.errors });
    }
    req.body = parsed.data;
    // console.log(parsed.data);
    next();
};

module.exports = validate;
