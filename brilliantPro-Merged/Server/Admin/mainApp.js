const express = require('express');
const app = express();
var cors= require("cors");
app.use(cors())
const admin=require("./admin")
const learner=require("./learners.js")

app.use('/admin',admin )
app.use('/learner',learner )

module.exports = app

app.listen(3000, () =>
    console.log('Listening on port 3000'));