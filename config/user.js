const express = require('express')
const userApi = require('../apis/db/user')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const userRouter = express.Router()
const bcrypt = require('bcrypt')

//Get user
userRouter.get('/', auth, (req, res) => {
    //If auth middleware hydrated req with user info
    if (req.user !== undefined) {
        //Get user info
        userApi.getOne({
            id: req.user.id
        })
            .then((data) => {
                //Sanitize user info and send it back
                delete data.password
                res.status(200).send({
                    data: {                
                        user: data
                    }
                })
            })
            .catch((err) => {
                console.log(err.message, 'Error @ GET /user')
                res.status(500).send({message: "Internal Server Error"})
            })
    } else {
        res.status(300).send({message: "You are not logged in"})
    }
})

//Login
userRouter.put('/', (req,res) => {
    let userData
    userApi.getOne({email: req.body.email})
        .then((data) => {
            //If there's a user with that email
            if (data) {            
                userData = data
                //Compare password hashes
                bcrypt.compare(req.body.password, userData.password)
                    .then((data) => {
                        //If password hashed match
                        if (data) {
                            delete userData.password
                            const token = jwt.sign({
                                id: userData.id
                            }, process.env.SECRET_KEY, { expiresIn: '1h' })
                            //Respond with valid token
                            res.status(200).send({
                                data: {
                                    user: userData,
                                    token
                                }
                            })
                            res.status(200).send()
                        } else {
                            res.status(422).send({ message: "Invalid credentials" })
                        }
                    });
            } else {
            res.status(422).send({ message: "Invalid credentials" })  
        }
    })
})

//Register
userRouter.post('/', (req, res) => {
    //Check user input is valid
    if(!req.body) {
        res.status(422).send({message: 'User credentials not included with the request'})
    } else if (!req.body.username || typeof req.body.username !== 'string') {
        if (!req.body.username) {
            res.status(422).send({message: 'Username not included with the request'})
        } else {
            res.status(422).send({ message: 'Username provided is not a string' })
        }
    } else if (!req.body.email || typeof req.body.email !== 'string') {
        if (!req.body.email) {
            res.status(422).send({ message: 'Email not included with the request' })
        } else {
            res.status(422).send({ message: 'Email provided is not a string' })
        }
    } else if (!req.body.password || typeof req.body.password !== 'string') {
        if (!req.body.password) {
            res.status(422).send({ message: 'Password not included with the request' })
        } else {
            res.status(422).send({ message: 'Password provided is not a string' })
        }
    } else {
        //User input is valid- hash pass and insert user into database
        bcrypt.hash(req.body.password, 10).then((hash) => {
            return userApi.insert({
                ...req.body,
                password: hash
            })
        })
        .then((data) => {
            //Construct valid token
            const token = jwt.sign({
                id: data.id
            }, process.env.SECRET_KEY, { expiresIn: '1h' })
            //Send back user data with valid token
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
                console.log(err.message)
                res.status(500).send({message: 'Internal Server Error'})
            }
        })
    }
})

module.exports = userRouter