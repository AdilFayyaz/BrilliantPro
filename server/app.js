const MongoClient = require("mongodb").MongoClient;

// Connection url
const url = "mongodb://localhost:27017";
// Database Name
const dbName = "demo-db";

// Connect using MongoClient
const mongoClient = new MongoClient(url);

const express = require('express');
var cors = require('cors');
const { ObjectId } = require("mongodb");
const app = express();
app.use(cors())

// Add GET/POST calls here



module.exports = app
app.listen(3000, () =>
  console.log('Listening on port 3000'));

