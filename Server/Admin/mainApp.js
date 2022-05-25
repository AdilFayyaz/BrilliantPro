const express = require('express');
const app = express();
var cors= require("cors");
app.use(cors())
const admin=require("./admin")

app.use('/admin',admin )

module.exports = app

app.listen(3000, () =>
    console.log('Listening on port 3000'));