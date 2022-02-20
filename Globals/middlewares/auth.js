require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{
    const authHeader = req.headers.autorization;

    if(!authHeader)
        return res.status(401).send({ error: 'No Token provided'});

    
    token = authHeader

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
       if (err) return res.status(401).send({ error: 'Token invalido'})

       req.user = decoded;

       return next()
    } )

  
}