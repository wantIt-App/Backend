const express = require('express')
const userApi = require('../apis/db/user')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const userRouter = express.Router()
const bcrypt = require('bcrypt')

//Get user
userRouter.get('/', auth, (req,res) => {
    if(req.user !== undefined) {
        userApi.getOne({
            id: req.user.id
        })
        .then((data) => {
            delete data.password
            res.status(200).send({
                data: {                
                    user: data
                }
            })
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
            const token = jwt.sign({
                id: data.id
              }, process.env.SECRET_KEY, { expiresIn: '1h' })
            res.status(200).send({
                data: {
                    user: userData,
                    token
                }
            })
            res.status(200).send()
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
    bcrypt.hash(req.body.password, 10).then((hash) => {
        return userApi.insert({
            ...req.body,
            password: hash
        })
    })
    .then((data) => {
        //can't chain first() onto a knex insert
        data = data[0]
        const token = jwt.sign({
            id: data.id
          }, process.env.SECRET_KEY, { expiresIn: '1h' })
        res.status(200).send({
            data: {
                user: data,
                token
            }
        })
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