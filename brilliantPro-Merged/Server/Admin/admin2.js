const MongoClient = require("mongodb").MongoClient;

// Connection url
const url = "mongodb://localhost:27017";
// Database Name
const dbName = "brilliantPro";

// Connect using MongoClient
const mongoClient = new MongoClient(url);

const express = require('express');
const multer = require('multer');
const fs = require('fs');

var cors = require('cors');
const { ObjectId } = require("mongodb");
const { async } = require("rxjs");
var bodyParser = require('body-parser')
var router=express.Router();
router.use(cors())
router.use(express.json())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
// Add GET/POST calls here
let storage = multer.diskStorage({
  destination: (req, file, f) => {
    f(null, '../../src/assets/Materials/');
  },
  filename: (req, file, f) => {
    f(null, file.originalname);
  }
});
let upload = multer({
  storage: storage
});

// upload Materials
router.post('/uploadMaterialContent', upload.array('Materials'), function(req, res){
  // Push all materials to folders collection
  mongoClient.connect(function(err, client){
    const db = client.db(dbName);
    db.collection("folder").find({_id: ObjectId(req.query.folderId)}).toArray(
      function(err, result){
        if(err) throw err;
        console.log(req.files)
        // Make a list of materials
        var listObj = []
        for(let i=0;i<req.files.length;i++){
          let obj = {}
          obj._id = new ObjectId()
          obj.name = req.files[i].originalname
          obj.path = req.files[i].path
          obj.type = req.files[i].originalname.split('.').pop()
          obj.isDownloadable = true
          listObj.push(obj)
        }
        // push listObj to array materials in folders collection
        db.collection("folder").updateOne({_id: ObjectId(req.query.folderId)}, {$push: {materials: {$each: listObj}}}, function(err, result){
          if(err) throw err;
          console.log(result)
        })
      }
    );
  });
  return res.json("File uploaded sucessfully")
})


// Create a folder given a name
router.post('/createFolder', async(req, res) =>{
  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("folder").insertOne({
        name: req.query.folderName,
        parent: "root",
        materials: []
      })
  })
  return res.json("Folder added sucessfully")
})

// get all folders
router.get('/getAllFolders', async(req, res) =>{
    mongoClient.connect(function(err, client) {
      const db = client.db(dbName);
      db.collection("folder").find({}).toArray(function(err, result){
        res.send(result);
    })
  })
})

// Delete file from folder
router.post('/deleteFileFromFolder', async(req, res) =>{
  // delete material from folder
  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("folder").updateOne({
        _id: new ObjectId(req.query.folderId)
      },{
        $pull: { materials: {_id : new ObjectId(req.query.materialId) }}
      })
  })
  return res.json("File deleted sucessfully")
})

//Delete a folder
router.post('/deleteFolder', async(req, res) =>{
  // find the folder and delete it
  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("folder").find({_id: new ObjectId(req.query.folderId)}).toArray(function(err, result){
      // if(result[0]){
      //     fs.rmdir("Materials/"+result[0].name, (err) => {
      //       if (err) {
      //         throw err;
      //       }
      //       console.log("Directory is deleted.");
      //   });
      // }
    })


  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("folder").deleteOne({
        _id: new ObjectId(req.query.folderId)
      })
  })
  return res.json("Folder deleted sucessfully")
})
})

// Update Folder Name
router.post('/updateFolderName', async(req, res) =>{
  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("folder").updateOne({
        _id: new ObjectId(req.query.folderId)
      },{
        $set: { name: req.query.name }
      })
    })
    return res.json("Folder name updated sucessfully")
  })

// Add file to folder
router.post('/uploadFileToServerOnFolder', async(req, res) =>{
  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("folder").updateOne({
        _id: new ObjectId(req.query.folderId)
      },{
        $push: { files: new ObjectId(req.query.fileId) }
      })
    })
})

// Edit a folder Name
router.post('/editFolder', async(req, res) =>{
  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("folder").updateOne({
        _id: new ObjectId(req.query.folderId)
      },{
        $set: { name: req.query.folderName }
      })
    })
    return res.json("Folder name updated sucessfully")
  })

// Edit a material in folder
router.post('/editMaterial', async(req, res) =>{
  req.body._id = new ObjectId(req.body._id)

  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("folder").updateOne({
        _id: new ObjectId(req.query.folderId),
        "materials._id": new ObjectId(req.query.materialId)
      },{
        $set: { "materials.$": req.body }
      })
    })
    return res.json("Folder name updated sucessfully")
  })




// ///////////////ASSESSMENTS////////////////////////////
// Add an assessment
router.post('/addAssessment', async(req, res) =>{
  console.log(req.body)
  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("assessment").insertOne({
        name: req.body.assessment_name,
        minPassing: req.body.assessment_minPassing,
        time: req.body.assessment_time,
        questions: []
      })
  })
  return res.json("Assessment added sucessfully")
})

// Get all assessments
router.get('/getAllAssessments', async(req, res) =>{
    mongoClient.connect(function(err, client) {
      const db = client.db(dbName);
      db.collection("assessment").find({}).toArray(function(err, result){
        res.send(result);
    })
  })
})

// Delete an Assessment
router.post('/deleteAssessment', async(req, res) =>{
  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("assessment").deleteOne({
        _id: new ObjectId(req.query.id)
      })
  })
  return res.json("Assessment deleted sucessfully")
})

// Add MCQ to Assessment
router.post('/addMCQToAssessment', async(req, res) =>{
  console.log(req.body)
  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("assessment").updateOne({
        _id: new ObjectId(req.query.id)
      },{
        $push: { questions: {
          question: req.body.question,
          option1: req.body.option1,
          option2: req.body.option2,
          option3: req.body.option3,
          option4: req.body.option4,
          answer: req.body.correctAnswer
        } }
      })
  })
  return res.json("Question added sucessfully")
})

// Delete MCQ from Assessment
router.post('/deleteMCQFromAssessment', async(req, res) =>{
  console.log("Delete Called")
  console.log(req.body.question)
  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("assessment").updateOne({
        _id: new ObjectId(req.query.assessmentId)
      },{
        $pull: { questions: {
          question: req.body.question,
          option1: req.body.option1,
          option2: req.body.option2,
          option3: req.body.option3,
          option4: req.body.option4,
          answer: req.body.answer
        } }
      })
  })
  return res.json("Question deleted sucessfully")
})

// Edit an Assessment
router.post('/editAssessment', async(req, res) =>{
  console.log(req.body)

  var obj = {}
  if(req.body.assessment_name){obj.name=req.body.assessment_name}
  if(req.body.assessment_minPassing){obj.minPassing=req.body.assessment_minPassing}
  if(req.body.assessment_time){obj.time=req.body.assessment_time}

  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("assessment").updateOne({
        _id: new ObjectId(req.query.id)
      },{
        $set: obj
      })
  })
  return res.json("Assessment updated sucessfully")
})


// Edit a Question
router.post('/editQuestion', async(req, res) =>{
  console.log(req.query.questionP)
  var j = JSON.parse(req.query.questionP)
  var questionName = j.question

  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("assessment").updateOne({
        _id: new ObjectId(req.query.assessmentId),
        "questions.question": questionName
      },{
        $set: { "questions.$": req.body }
      })
  })
  return res.json("Question updated sucessfully")
})



/////////////////////////// LOGIN //////////////////////////////////
router.post('/login', async(req, res) =>{
   console.log("in login");
  mongoClient.connect(function(err, client) {
    const db = client.db(dbName);
    db.collection("learner").findOne({
        username: req.body.username,
        password: req.body.password
      }, function(err, result){
        if(err){
          throw err
        }
        if(result){
          return res.json(result);
        }
        else{
          db.collection("admin").findOne({
            username: req.body.username,
            password: req.body.password
          },
          function(err, result){
            if(err){
              throw err
            }
            if(result){
              return res.json(result);
            }
            else{
              return res.json("Invalid username or password")
            }
          })
        }
      })
    })
  })


module.exports = router

