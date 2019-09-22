const jwt = require('jsonwebtoken')
const auth = (req,res,next) => {
    if(req.headers.authorization === undefined) {
        res.status(400).send({message: 'You must be signed in'})
    } else {
        try {
        var decoded = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        req.user = decoded
        next()
        } catch(err) {
            console.log(err)
            res.status(400).send({message: 'Invalid token'})
        }
    }
}

  module.exports = auth