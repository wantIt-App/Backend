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
            inviteApi.insert({
                list_id: input.list_id,
                invitee_id: input.invitee_id
            })
                .then((data) => {
                    res.status(200).send({ data: { invite: data[0] } })
                })
                .catch((data) => {
                    res.status(500).send({message: "Internal Server Error"})
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
    } else if (input.invite_id === undefined) {
        res.status(422).send({ message: "No invite id was provided in the request" })
    } else if (!Number.isInteger(input.invite_id)) {
        res.status(422).send({ message: "Invite id must be an integer" })
    } else {
        const applicableInvite = await inviteApi.getOne({ id: input.invite_id })
        //Make sure the user inviting other users owns the list
        if (applicableInvite.invitee_id === req.user.id) {
            inviteApi.update({
                id: input.invite_id
            }, {
                rejected: !applicableInvite.rejected
            })
                .then((data) => {
                    res.status(200).send({ data: { invite: data[0] } })
                })
                .catch((data) => {
                    res.status(500).send({ message: "Internal Server Error" })
                })
        } else {
            res.status(422).send({ message: "You are not authorize to reject or accept this invite" })
        }
    }
})

module.exports = inviteRouter