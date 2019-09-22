require('dotenv').config()
const express = require('express')
// const session = require('cookie-session')
const helmet = require('helmet')
const server = express()
const userRouter = require('./config/user')
const listRouter = require('./config/list')
const itemRouter = require('./config/item')
const auth = require('./middleware/auth')

//Cookie middleware
// server.use(session({
//   name: 'session',
//   keys: [process.env.SECRET_KEY],
//   cookie: {
    //secure: true,
    //httpOnly: true,
    //domain: process.env.COOKIE_DOMAIN,
//     path: '/',
//     expires: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hour
//   }
// }))

server.use(express.json())
server.use(helmet())
server.use('/user', userRouter)
server.use('/list', auth, listRouter)
server.use('/item', auth, itemRouter)

server.get('/', auth, (req, res) => {
  res.status(200).send({message: 'I am alive'})
})

server.listen(process.env.PORT, ()=>console.log(`Server started at port ${process.env.PORT}`))