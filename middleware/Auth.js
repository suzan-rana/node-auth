const jwt = require('jsonwebtoken')
const SECRET_KEY = 'ae897635ca091a275aeeba4f322a4f4e21bdfe97e81afde5d169b89f3ac3f83bbceff7'
//checks if the token receivd from client is valid or not, if invalid sends a error response.
exports.adminAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if(token) {
        jwt.verify(token, SECRET_KEY, ( error, decodedToken) => {
            if( error ){
                return res.status(401).json({
                    message: "Not authorized.",
                    error: error.message,
                })
            } else {
                if( decodedToken.role !== "admin") {
                    return res.status(401).json({
                        message: 'Not authorized.'
                    })
                } else {
                    next();
                }
            }
        })
    } else {
        return res.status(401).json({
            message: "Not authorized, token not found."
        })
    }
}