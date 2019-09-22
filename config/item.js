const express = require('express')
const itemRouter = express.Router()
const itemApi = require('../apis/db/item')

//Get items from list
itemRouter.get('/:id', (req, res) => {
    itemApi.getMany({id: req.params.id})
    .then((data) => {
        res.status(200).send({data:{items: data}})
    })
})
//Add item to list
itemRouter.post('/', (req, res) => {
    itemApi.insert(req.body)
    .then(data => {
        data = data[0]
        res.status(200).send({data: {item: data}})
    })
})

module.exports = itemRouter
