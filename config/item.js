const express = require('express')
const itemRouter = express.Router()

itemRouter.get('/') //Get items from list
itemRouter.post('/') //Add item to list

module.exports = itemRouter
