const express = require('express');
const app = express();
var cors = require('cors')
app.use(cors())

const MongoClient = require("mongodb").MongoClient;

  // Connection url
  const url = "mongodb://localhost:27017";
  // Database Name
  const dbName = "brilliantPro";
  
  // Connect using MongoClient
  const mongoClient = new MongoClient(url);

  var bodyParser = require('body-parser');
const { ObjectId } = require('bson');
  var jsonParser = bodyParser.json()
  var urlencodedParser = bodyParser.urlencoded({ extended: false })

// gets course name from course id
  app.get('/courseName/:id', function (req, res) {
         console.log("Got a GET request course name ="+req.params.id);
  
  // var data={}
  mongoClient.connect(function (err, client) {
    const db = client.db(dbName);
   db.collection("course").find({'_id':ObjectId(req.params.id)})
.project({"name":1,endDate:1,startDate:1,"assessments":1})
       .toArray(function (err, data) {
      if (err) throw err;
      console.log(data);
      res.send(data);
    })
})

})

//   gets all completed/enrolled courses of the particular learner username 
  app.get('/learner/:learner/status/:status', function (req, res) {
    console.log("Got a GET request for /learner ="+req.params.learner);
  
    // var data={}
    mongoClient.connect(function (err, client) {
      const db = client.db(dbName);
     db.collection("learner").aggregate([{$match:{'username':req.params.learner}}, 
     {
                        $project: {
                            "courses": {
                                $filter: {
                                    input: "$courses",
                                    as: "course",
                                    cond: {$eq: ["$$course.status", req.params.status]}
                                }
                            },
                        }
                    }
])
.project(         {"username":0,"password":0 , _id:0})
         .toArray(function (err, data) {
        if (err) throw err;
        console.log(data[0].courses);
        res.send(data[0].courses);
      })
  })
  
  })

// 
// gets course material from course id
app.get('/courseMaterial/:id',async function (req, res) {
    console.log("Got a GET request course name ="+req.params.id);
    material=[]
    mongoClient.connect( function (err, client) {
        const db = client.db(dbName);

     
        db.collection("course").find({'_id':ObjectId(req.params.id)})
        .project({"materials":1}).toArray( function (err, data) 
        {
            if (err) throw err;
            console.log(data[0]);
            value=[]
            for(i=0;i<data[0].materials.length;i++)
            {
                value.push(ObjectId( data[0].materials[i]))
                // { $in: [<value1>, <value2>, ... <valueN> ] } 
            }
            console.log("val ",value)
                db.collection("material").find({'_id':{$in:value}})
                .toArray(function (err, data1) 
                {
                    if (err) throw err;
                    console.log(data1);
                    // material.push(data1)
                res.send(data1);

                })
               
            
            // res.send(material)
        })
       

    })

})



app.get('/courseProgress/:courseId/learner/:learner',async function (req, res) {
    console.log("Got a GET request progess ="+req.params.courseId);
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
       db.collection("learner").aggregate([{$match:{'username':req.params.learner}}, 
       {
                          $project: {
                              "courses": {
                                  $filter: {
                                      input: "$courses",
                                      as: "course",
                                      cond: {$eq: ["$$course.courseId", req.params.courseId]}
                                  }
                              },
                          }
                      }
  ])
  .project( {"username":0,"password":0 , _id:0})
           .toArray(function (err, data) {
          if (err) throw err;
          console.log(data[0].courses[0].progress);
          res.send(data[0].courses[0]);
        })
    })
    
})

// update progress of learner(username) in a given course(id)
app.post('/UpdateCourseProgress/:courseId/learner/:learner/progress/:progress',async function (req, res) {
    console.log("Got a GET request progess update ="+req.params.progress);
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
       db.collection("learner").updateMany({username:req.params.learner,"courses.courseId":req.params.courseId},{$set: {"courses.$.progress":req.params.progress}})

    })
    
})
// get assessment from id
app.get('/getAssessment/:id', function (req, res) {
    console.log("Got a GET request assessment ="+req.params.id);

// var data={}
mongoClient.connect(function (err, client) {
const db = client.db(dbName);
db.collection("assessment").find({'_id':ObjectId(req.params.id)})
// .project({"name":1,endDate:1,startDate:1,"assessments":1})
  .toArray(function (err, data) {
 if (err) throw err;
 console.log(data);
 res.send(data);
})
})

})

  module.exports = app

app.listen(3000, () =>
  console.log('Listening on port 3000'));
