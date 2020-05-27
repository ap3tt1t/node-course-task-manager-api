// Requires
const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// Setup Express
const app = express()

// Auto JSON Output
app.use(express.json())

// Middleware

// Routes

app.use(userRouter)
app.use(taskRouter)

module.exports = app
