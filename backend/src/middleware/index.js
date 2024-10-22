import { JWT_SECRET } from "../constants.js";
import jwt from 'jsonwebtoken'

const authMiddleware = (req,res,next)=>{
    console.log(req.headers) ;
    
    const authHeader = req.headers.authorization; 
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({}) ;
    }

    const token = authHeader.split(' ')[1] ;
    try {
        const decoded = jwt.verify(token , JWT_SECRET) ;

        req.userId = decoded.userId ;
        next() ;
    } catch (error) {
        return res.status(403).json({message :"You are not authorized user"})
    }
}

export {authMiddleware}