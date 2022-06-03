const express = require('express');
const app = express();
var cors= require("cors");
app.use(cors())
const admin=require("./admin")
const learner=require("./learners.js")
const admin2=require("./admin2")

app.use('/admin',admin )
app.use('/learner',learner )
app.use('/',admin2 )

module.exports = app

app.listen(3000, () =>
    console.log('Listening on port 3000'));