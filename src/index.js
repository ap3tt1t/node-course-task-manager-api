// Requires
const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// Setup Express
const app = express()
const port = process.env.PORT

// Auto JSON Output
app.use(express.json())

// Middleware

// Routes

app.use(userRouter)
app.use(taskRouter)



// Listen
app.listen(port, () => {
    console.log('Server is up on port', port)
})

