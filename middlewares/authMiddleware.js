const {verifyToken} = require('../utils/token');

const authMiddleware = (req,res,next) =>{
    const token = req.header('Authorization').replace('Bearer','');
    if(!token){
        return res.status(401).json({message:'Access denied'})
    }
    try{
        const payload = verifyToken(token);
        req.user = payload;
        next();
    }
    catch (e){
        res.status(400).json({message: 'invalid token'})
    }
};

module.exports = authMiddleware;