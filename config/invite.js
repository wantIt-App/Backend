const express = require('express')
const inviteRouter = express.Router()
const inviteApi = require('../apis/db/invite')
const listApi = require('../apis/db/list')

//Invite user to list
inviteRouter.post('/', async (req, res) => {
    const input = req.body
    //Validate Input
    if (!input) {
        res.status(422).send({ message: "No invite information was provided in the request" })
    } else if (input.list_id === undefined) {
        res.status(422).send({ message: "No list id was provided in the request" })
    } else if (input.invitee_id === undefined) {
        res.status(422).send({ message: "No invitee id was provided in the request" })
    } else if (!Number.isInteger(input.list_id)) {
        res.status(422).send({ message: "List id must be an integer" })
    } else if (!Number.isInteger(input.invitee_id)) {
        res.status(422).send({ message: "Invitee id must be an integer" })
    } else {
        const applicableList = await listApi.getOne({ id: input.list_id })
        //Make sure the user inviting other users owns the list
        if (applicableList.owner_id === req.user.id) {
            console.log({
                list_id: input.list_id,
                invitee_id: input.invitee_id
            })
            inviteApi.insert({
                list_id: input.list_id,
                invitee_id: input.invitee_id
            })
                .then((data) => {
                    console.log(data)
                    res.status(200).send({ data: { invite: data[0] } })
                })
                .catch((err) => {
                    if (err.message.includes('unique constraint')) {
                        res.status(200).send({ message: 'This user has already been invited to this list' })
                    } else {
                        console.log(err.message, 'Error @ POST /invite')
                        res.status(500).send({message: "Internal Server Error"})
                    }
                })
        } else {
            res.status(422).send({ message: "You don't own this list" })
        }
    }
})

//Toggle list invite state
inviteRouter.put('/toggle', async (req, res) => {
    const input = req.body
    //Validate Input
    if (!input) {
        res.status(422).send({ message: "No invite information was provided in the request" })
    } else if (input.list_id === undefined) {
        res.status(422).send({ message: "No list id was provided in the request" })
    } else if (!Number.isInteger(input.list_id)) {
        res.status(422).send({ message: "List id must be an integer" })
    } else {
        //Include user's ID to make sure the user is the invitee
        const applicableInvite = await inviteApi.getOne({ list_id: input.list_id, invitee_id: req.user.id })
        if (applicableInvite) {
            inviteApi.update({
                list_id: input.list_id,
                invitee_id: req.user.id
            }, {
                //Toggle the rejected state
                rejected: !applicableInvite.rejected
            })
                .then((data) => {
                    res.status(200).send({ data: { invite: data[0] } })
                })
                .catch((err) => {
                    console.log(err.message, 'Error @ PUT /invite/toggle')
                    res.status(500).send({ message: "Internal Server Error" })
                })
        } else {
            res.status(422).send({ message: "This invite does not belong to you" })
        }
    }
})

module.exports = inviteRouter