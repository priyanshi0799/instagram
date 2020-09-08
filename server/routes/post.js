const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')


router.get('/allpost' ,requireLogin, (req,res) => {
    Post.find()
    .populate('postedBy' , '_id name email')
    .then(posts => {
        res.json({posts})
    }).catch(err => {
        res.send(err)
    })
})

router.post('/createpost', requireLogin , (req,res) => {
    const { title, body} = req.body
    if(!title || !body){
        return res.status(422).json('Please add all the fields')
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy : req.user
    })
    post.save()
    .then(res => {
        res.json({post : res})
    })
    .catch(err => {
        res.send(err)
    })
})

router.get('/mypost', requireLogin , (req,res) => {
    Post.find({postedBy : req.user._id})
    .populate('postedBy' , '_id name email')
    .then(mypost => {
        res.json({mypost})
    }).catch(err => {
        res.send(err)
    })
})

module.exports = router