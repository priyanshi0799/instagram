const express = require('express')
const app = express()
const PORT = 5000

const customMiddleware = (req,res,next) => {
    console.log('Middleware executed')
    next()
}

app.use(customMiddleware)

app.get('/', (req,res) => {
    console.log('Route Handler')
    res.send('Hello World')
})

app.get('/about' , (req,res) => {
    console.log('About is executed')
    res.send('About Page')
})

app.listen(PORT , () => {
    console.log('Server is running on ', PORT)
})