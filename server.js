const express = require('express')
const compression = require('compression')

const app = express()

app.use(compression())
app.use(express.static('./dist'))

app.listen(80,() => {
    console.log('your application is running at localhost:80！')
})

// https的配置
// const https = require('https')
// const fs = require('fs')

// const options = {
//     cert:fs.readFileSync(''),
//     key:fs.readFileSync('')
// }
// https.createServer(options,app).listen(443)