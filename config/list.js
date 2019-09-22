const express = require('express')
const listRouter = express.Router()
const listApi = require('../apis/db/list')
const inviteApi = require('../apis/db/list')

//Get lists of signed in user
listRouter.get('/my', (req,res) => {
    return listApi.getMany({owner_id: req.user.id})
    .then(data => {
        res.status(200).send({data: {lists: data}})
    })
})

//Get lists signed in user has been invited to
listRouter.get('/invited', (req,res) => {
    return inviteApi.getMany({invitee_id: req.user.id})
        .then((data) => {
            return Promise.all(data.map(invite => listApi.getOne({id: invite.list_id})))
        })
        .then(data => {
            res.status(200).send({data: {lists: data}})
        })
})

//Add list
listRouter.post('/', (req,res) => {
    return listApi.insert(req.body)
    .then(data => {
        res.status(200).send({data: {lists: data}})
    })
})

module.exports = listRouter