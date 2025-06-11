const validate = (schema) => (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        console.log("Validation Error:", parsed.error.errors); 
        return res.status(400).json({ error: parsed.error.errors });
    }
    req.body = parsed.data;
    next();
};

module.exports = validate;
