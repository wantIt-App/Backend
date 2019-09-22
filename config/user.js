const express = require('express')
const userApi = require('../apis/db/user')
const userRouter = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10

//Get user
userRouter.get('/', (req,res) => {
    if(req.session.user !== undefined) {
        userApi.getOne({
            id: req.session.user
        })
        .then((data) => {
            delete data.password
            res.status(200).send({data})
        })
        .catch((err) => {
            res.status(500).send({message: "Internal Server Error"})
        })
    } else {
        res.status(300).send({message: "You are not logged in"})
    }
})

//Login
userRouter.put('/', (req,res) => {
    let userData;
    userApi.getOne({email: req.body.email})
    .then((data) => {
        userData = data
        return bcrypt.compare(req.body.password, userData.password)
    })
    .then((data) => {
        if(data) {
            delete userData.password
            //set user id in session cookie
            req.session = {
                user: data.id
            }
            res.status(200).send({data: userData})
        } else {
            res.status(422).send({message: "Invalid credentials"})
        }
    });
})

//Register
userRouter.post('/', (req,res) => {
    if(!req.body) {
        res.status(422).send({message: 'User credentials not included with the request'})
    } else if (!req.body.username) {
        res.status(422).send({message: 'Username not included with the request'})
    }  else if (!req.body.email) {
        res.status(422).send({message: 'Email not included with the request'})
    }  else if (!req.body.password) {
        res.status(422).send({message: 'Password not included with the request'})
    }
    bcrypt.hash(req.body.password, saltRounds).then((hash) => {
        return userApi.insert({
            ...req.body,
            password: hash
        })
    })
    .then((data) => {
        //can't chain first() onto a knex insert
        data = data[0]
        //set user id in session cookie
        req.session = {
            user: data.id
        }
        res.status(200).send({data})
    })
    .catch(err => {
        if(err.message.includes('users_username_unique')) {
            res.status(200).send({message: 'This username is already taken'})
        } else if(err.message.includes('users_email_unique')) {
            res.status(200).send({message: 'This email is already taken'})
        } else {
            res.status(500).send({message: 'Internal Server Error'})
        }
    })
})

module.exports = userRouter