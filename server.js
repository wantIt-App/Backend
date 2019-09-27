require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const server = express()
const userRouter = require('./config/user')
const listRouter = require('./config/list')
const itemRouter = require('./config/item')
const inviteRouter = require('./config/invite')
const auth = require('./middleware/auth')

//For Picture Uploading
const cloudinary = require('cloudinary')
const formData = require('express-form-data')
const cors = require('cors')
const { CLIENT_ORIGIN } = require('./config')

//Picture Uploading
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
})

server.use(express.json())
server.use(helmet())
server.use('/user', userRouter)
server.use('/list', auth, listRouter)
server.use('/item', auth, itemRouter)
server.use('/invite', auth, inviteRouter)

server.get('/', (req, res) => {
  res.status(200).send({message: 'I am alive'})
})

server.use(cors({ 
  origin: CLIENT_ORIGIN 
})) 

server.use(formData.parse())

server.get('/wake-up', (req, res) => res.send('👌'))

server.post('/image-upload', (req, res) => {

  const values = Object.values(req.files)
  const promises = values.map(image => cloudinary.uploader.upload(image.path))
  
  Promise
    .all(promises)
    .then(results => res.json(results))
    .catch((err) => res.status(400).json(err))
})

server.listen(process.env.PORT, ()=>console.log(`Server started at port ${process.env.PORT}`))













  


