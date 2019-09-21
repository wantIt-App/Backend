const express = require('express')
const listRouter = express.Router()

listRouter.get('/') //Get lists of signed in user
listRouter.post('/') //Add list

module.exports = listRouter