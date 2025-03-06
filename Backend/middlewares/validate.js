
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next(); // Proceed if validation passes
    } catch (err) {
        res.status(400).json({ errors: err.errors })
    }
}

module.exports = { validate }