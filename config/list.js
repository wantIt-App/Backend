const express = require('express')
const listRouter = express.Router()
const listApi = require('../apis/db/list')
const inviteApi = require('../apis/db/invite')

//Get lists of signed in user
listRouter.get('/created', (req,res) => {
    return listApi.getMany({owner_id: req.user.id})
        .then(data => {
            res.status(200).send({data: {lists: data}})
        })
        .catch(err => {
            console.log(err.message, 'Error @ GET /list/created')
            res.status(500).send({ message: "Internal Server Error" })
        })
})

//Get lists signed in user has been invited to
listRouter.get('/invited', (req, res) => {
    //Initialize database query filter
    let filter = { invitee_id: req.user.id, rejected: false }
    //Declare response function to keep code DRY
    const sendResponse = () => {
        inviteApi.getMany(filter)
        .then((data) => {
            return Promise.all(data.map(invite => listApi.getOne({ id: invite.list_id })))
        })
        .then(data => {
            res.status(200).send({ data: { lists: data } })
        })
        .catch(err => {
            console.log(err.message, 'Error @ GET /list/invited')
            res.status(500).send({ message: "Internal Server Error" })
        })
    }
    //If the rejected query parameter was included
    if (req.query && req.query.rejected) {
        let rejected = req.query.rejected
        rejected = rejected.toLowerCase()
        //Validate the user input
        if (rejected === "true" || rejected === "false") {
            filter.rejected = rejected === "true"
            sendResponse()
        } else {
            res.status(422).send({ message: 'The query param "rejected" must be either "true" or "false"' })
        }
    } else {
        sendResponse()
    }
})

//Add list
listRouter.post('/', (req, res) => {
    //Validate user input
    let input = req.body
    if (!input) {
        res.status(422).send({ message: "No list information was provided in the request" })
    } else if (input.name === undefined) {
        res.status(422).send({ message: "No list name was provided in the request" })
    } else if (input.description === undefined) {
        res.status(422).send({ message: "No list description was provided in the request" })
    } else if (typeof input.name !== "string") {
        res.status(422).send({ message: "List name must be a string" })
    } else if (typeof input.description !== "string") {
        res.status(422).send({ message: "List description must be a string" })
    } else {
        //Hydrate input with user id as list's owner_id
        input.owner_id = req.user.id
        return listApi.insert(input)
            .then(data => {
                res.status(200).send({data: {lists: data}})
            })
            .catch(err => {
                console.log(err.message, 'Error @ POST /list')
                res.status(500).send({ message: "Internal Server Error" })
            })
    }
})

module.exports = listRouter