// Require
const app = require('./app')

//Port
const port = process.env.PORT

// Listen
app.listen(port, () => {
    console.log('Server is up on port', port)
})

