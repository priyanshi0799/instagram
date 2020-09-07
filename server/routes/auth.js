const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const User = mongoose.model('User')

router.get('/', (req,res) => {
    res.send('Home Route')
})

router.post('/signup' , (req,res) => {
    const { name , email , password} = req.body
    if(!email || !password || !name){
        return res.status(422).json({
            error : 'Please add all the fields'
        })
    }

    User.findOne({email : email})
        .then((savedUser) => {
            if(savedUser){
                return res.status(422).json({
                    error : 'User already exists'
                })
            }else{
                const user = new User({
                    email: email,
                    password : password,
                    name : name
                })
                user.save()
                    .then(user => {
                        res.json({
                            message: 'Saved Successfully'
                        })
                    })
                    .catch(err => {
                        res.send(err)
                    })
            }
        })
        .catch(err => {
            res.send(err)
        })
})

module.exports = router