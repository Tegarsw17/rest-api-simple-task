const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { taskRouter, userRouter } = require('./src/router')

app.use(bodyParser.json())

app.use(taskRouter)
app.use(userRouter)

module.exports = app
