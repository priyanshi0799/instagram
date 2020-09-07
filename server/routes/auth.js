const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const User = mongoose.model('User')

const bcrypt = require('bcryptjs')


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
                bcrypt.hash(password , 14)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password : hashedPassword,
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
                })
                
            }
        })
        .catch(err => {
            res.send(err)
        })
})

router.post('/signin' , (req,res) => {
    const { email , password} = req.body
    if(!email || !password){
        return res.status(422).json({
            error : 'Please add all the fields'
        })
    }
    User.findOne({email : email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).json({error : 'Invalid email or password'})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch){
                //res.json({message: 'Success'})
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                res.json({token : token})
            }else{
                return res.status(422).json({error : 'Invalid email or password'})
            }
        })
        .catch(err => {
            res.send(err)
        })
    })
    .catch(err => {
        res.send(err)
    })
})

module.exports = router