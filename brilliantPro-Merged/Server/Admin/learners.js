var express=require("express")
var router = express.Router()


const {ObjectID: ObjectId} = require("mongodb");
const cors = require("cors");

router.use(cors())


// Connect using a MongoClient instance
const MongoClient = require("mongodb").MongoClient;

// Connection url
const url = "mongodb://localhost:27017";
// Database Name
const dbName = "brilliantPro";

// Connect using MongoClient
const mongoClient = new MongoClient(url);

router.use(
    express.urlencoded({
        extended: true,
    })
);
router.use(express.json());

router.get("/", function (req, res){
    res.send("In learner")
})

// gets course name from course id
router.get('/courseName/:id', function (req, res) {
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
router.get('/:learner/status/:status', function (req, res) {
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
router.get('/courseMaterial/:id',async function (req, res) {
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



router.get('/courseProgress/:courseId/learner/:learner',async function (req, res) {
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
router.post('/UpdateCourseProgress/:courseId/learner/:learner/progress/:progress',async function (req, res) {
console.log("Got a GET request progess update ="+req.params.progress);
mongoClient.connect(function (err, client) {
   const db = client.db(dbName);
  db.collection("learner").updateMany({username:req.params.learner,"courses.courseId":req.params.courseId},{$set: {"courses.$.progress":req.params.progress}})

})

})
// get assessment from id
router.get('/getAssessment/:id', function (req, res) {
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


// 
// update done assessments of learner
router.post('/UpdateAssignmentsDone/:courseId/learner/:learner',async function (req, res) {
    console.log("Got a GET request assessment done update ="+JSON.stringify(req.body.done)," ", req.params.courseId," ",req.params.learner);
    mongoClient.connect(function (err, client) {
       const db = client.db(dbName);
      db.collection("learner").updateMany({username:req.params.learner,"courses.courseId":req.params.courseId},{$push: {"courses.$.assessmentsDone":req.body.done}}).catch(error => console.log('errror', error));
      res.send("update done!")
    })
    
})
// get done assessments of learner of a particular course
router.get('/getAssignmentsDone/:courseId/learner/:learner',async function (req, res) {
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
         console.log(data[0].courses[0].assessmentsDone);
         res.send(data[0].courses[0].assessmentsDone);
       })
    })
    
    })
router.use(express.json());

module.exports=router