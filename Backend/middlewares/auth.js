const jwt = require('jsonwebtoken')


function isAuthenticated(req, res, next) {
    try {
        const token = req.cookies?.token || req?.headers?.authorization?.split(" ")[1]
        if (!token) {
            res.status(401).json({ message: "Token Not Found. Unauthorized" })
        }
        console.log(process.env.JWT_SECRET)
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            req.userId = decoded.userId;
            next()
    } catch (error) {
        console.log("Error in isAuthenitcated MiddleWare. Error: ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


module.exports = { isAuthenticated }