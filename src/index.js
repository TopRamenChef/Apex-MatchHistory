const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')

const dataRouter = require('./router/apexdata')
// const singularRouter = require('./router/singular')
app.use(dataRouter)
// app.use(singularRouter)

app.use(express.static(publicDirectoryPath))


app.listen(port, () => {
    console.log("Server is up on port",port)
})
