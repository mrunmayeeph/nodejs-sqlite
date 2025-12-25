//handle all the authentication btw client and server

import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next){
    //get token from headers
    const token = req.headers['authorization'];
    if(!token){
        return  res.status(401).send({message: "No token provided."});
    }

    //verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).send({message: "Invalid token."});
        }
        req.userId = decoded.id; // set userId in request object for further use
        next(); // you may proceed to the endpoint
    })
}

export default authMiddleware;