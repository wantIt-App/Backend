const express = require('express')
const itemRouter = express.Router()
const itemApi = require('../apis/db/item')
const listApi = require('../apis/db/list')

//Get items from list
itemRouter.get('/:id', (req, res) => {
    //Input type conversion
    let id = parseInt(req.params.id)
    //Validate input
    if (!Number.isInteger(id)) {
        res.status(422).send({ message: "List id must be an integer" })
    } else {
        itemApi.getMany({ list_id: id })
            .then((data) => {
                if (data.length > 1) {
                    res.status(200).send({ data: { items: data } })
                } else {
                    //Return needed because of warning:
                    //"Warning: a promise was created in a handler but was not returned from it"
                    return listApi.getOne({ id })
                        .then(() => {
                            res.status(200).send({ data: { items: [] } })
                        })
                        .catch(() => {
                            res.status(422).send({ message: "The list id provided does not exist" })
                        })
                }
            })
            .catch(err => {
                console.log(err, 'Error @ GET /item')
                res.status(500).send({ message: "Internal Server Error" })
            })
    }
})

//Add item to list
itemRouter.post('/', (req, res) => {
    const input = req.body
    //Validate Input
    if (!input) {
        res.status(422).send({ message: "No item information was provided in the request" })
    } else if (input.list_id === undefined) {
        res.status(422).send({ message: "No list id was provided in the request" })
    } else if (input.title === undefined) {
        res.status(422).send({ message: "No item title was provided in the request" })
    } else if (input.description === undefined) {
        res.status(422).send({ message: "No item description was provided in the request" })
    } else if (input.picture === undefined) {
        res.status(422).send({ message: "No item picture was provided in the request" })
    } else if (!Number.isInteger(input.list_id)) {
        res.status(422).send({ message: "List id must be an integer" })
    } else if (typeof input.title !== "string") {
        res.status(422).send({ message: "Item title must be a string" })
    } else if (typeof input.description !== "string") {
        res.status(422).send({ message: "Item description must be a string" })
    } else if (typeof input.picture !== "string") {
        res.status(422).send({ message: "Item picture must be a string" })
    } else {
        itemApi.insert(input)
            .then(data => {
                res.status(200).send({data: {item: data}})
            })
            .catch(err => {
                if (err.message.includes('foreign key constraint')) {
                    res.status(422).send({ message: "List id provided does not exist" })
                } else {
                    console.log(err.message, 'Error @ POST /item')
                    res.status(500).send({message: "Internal Server Error"})
                }
            })
    }
})

module.exports = itemRouter
