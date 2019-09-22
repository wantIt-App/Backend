require('dotenv').config()
const express = require('express')
const session = require('cookie-session')
const helmet = require('helmet')
const server = express()
const userRouter = require('./config/user')
const listRouter = require('./config/list')
const itemRouter = require('./config/item')

//Cookie middleware
server.use(session({
  name: 'session',
  keys: [process.env.SECRET_KEY],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN,
    path: '/',
    expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  }
}))

//Auth middleware
const auth = (req,res,next) => {
  console.log(req.session, 'session in middleware')
  if(req.session.user === undefined) {
    res.status(400).send({message: 'You must be signed in'})
  } else {
    next()
  }
}

server.use(express.json())
server.use(helmet())
server.use('/user', userRouter)
server.use('/list', auth, listRouter)
server.use('/item', auth, itemRouter)

server.get('/', (req, res) => {
  console.log(req.session)
  res.status(200).send({message: 'I am alive'})
})

server.listen(process.env.PORT, ()=>console.log(`Server started at port ${process.env.PORT}`))