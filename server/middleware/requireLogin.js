const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const { JWT_SECRET } = require('../keys')
const { use } = require('../routes/auth')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if(!authorization){
        return res.status(401).json({error : 'You are not authorized'})
    }else{
        const token = authorization.replace("Bearer ", "")
        jwt.verify(token, JWT_SECRET , (err , payload) => {
            if(err){
                return res.status(401).json({error : 'You are not authorized'})
            }
            else{
                const { _id } = payload
                User.findOne(_id)
                .then(userdata => {
                    req.user = userdata
                })
                .catch(err => {
                    res.send(err)
                })

                next()
            }
        })
    }
}