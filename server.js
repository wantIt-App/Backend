require('dotenv').config()
const express = require('express')
const session = require('cookie-session')
const helmet = require('helmet')
const server = express()
const userRouter = require('./config/user')
 
server.use(session({
  name: 'session',
  keys: [process.env.SECRET_KEY],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  }
}))
server.use(helmet())
server.use('/user', userRouter)

server.get('/', (req, res) => {
    res.status(200).send({message: 'I am alive'})
})

server.listen(process.env.PORT, ()=>console.log(`Server started at port ${process.env.PORT}`))