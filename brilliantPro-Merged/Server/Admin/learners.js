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
.project({"name":1,endDate:1,startDate:1,"assessments":1,"minPassScore":1})
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
    
           console.log("vals ",value)
               db.collection("folder").find({}).project({"materials":1})
               .toArray(function (err, data1) 
               {
                   if (err) throw err;
                   console.log("got material",JSON.stringify(data1[0].materials));
                   for(let j=0;j<data1.length;j++){
                        sending1=[]
                        for(let i=0;i<data1[j].materials.length;i++){
                            console.log("out",String(data1[j].materials[i]._id))
                            for(let j=0;j<value.length;j++){
                                if(String(data1[0].materials[i]._id)==String(value[j])){
                                    console.log("in")
                                    sending1.push(data1[0].materials[i])
                                }
                            }
                        }
                    }
               console.log("final materials",sending1)
               res.send(sending1)
    
               })
              
           
           // res.send(material)
       })
      
    
    })
    
    })


// get progress
router.get('/courseProgress/:courseId/learner/:learner',async function (req, res) {
console.log("Got a GET request progess ="+req.params.courseId,"-",req.params.learner);
mongoClient.connect(function (err, client) {
   const db = client.db(dbName);
  db.collection("learner").aggregate([{$match:{'username':req.params.learner}}, 
  {
                     $project: {
                         "courses": {
                             $filter: {
                                 input: "$courses",
                                 as: "course",
                                 cond: {$eq: ["$$course.courseId", ObjectId(req.params.courseId)]}
                             }
                         },
                     }
                 }
])
.project( {"courses":1})
      .toArray(function (err, data) {
     if (err) throw err;
     console.log("prog-",JSON.stringify(data[0].courses[0].progress));
     res.send((data[0].courses[0]));
   })
})

})

// update progress of learner(username) in a given course(id)
router.post('/UpdateCourseProgress/:courseId/learner/:learner/progress/:progress',async function (req, res) {
console.log("Got a GET request progess update ="+req.params.progress);
mongoClient.connect(function (err, client) {
   const db = client.db(dbName);
  db.collection("learner").updateMany({username:req.params.learner,"courses.courseId":ObjectId(req.params.courseId)},{$set: {"courses.$.progress":req.params.progress}})

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
      db.collection("learner").updateMany({username:req.params.learner,"courses.courseId":ObjectId(req.params.courseId)},{$push: {"courses.$.assessmentsDone":req.body.done}}).catch(error => console.log('errror', error));
      res.send("update done!")
    })
    
})

// get done assessments of learner of a particular course
router.get('/getAssignmentsDone/:courseId/learner/:learner',async function (req, res) {
    console.log("Got a GET request assign done ="+req.params.courseId,"-",req.params.learner );
    mongoClient.connect(function (err, client) {
       const db = client.db(dbName);
      db.collection("learner").aggregate([{$match:{'username':req.params.learner}}, 
      {
                         $project: {
                             "courses": {
                                 $filter: {
                                     input: "$courses",
                                     as: "course",
                                     cond: {$eq: ["$$course.courseId", ObjectId( req.params.courseId)]}
                                 }
                             },
                         }
                     }
    ])
    .project( {"username":0,"password":0 , _id:0})
          .toArray(function (err, data) {
         if (err) throw err;
         console.log("assess done",data);
         res.send(data[0].courses[0].assessmentsDone);
       })
    })
    
    })

// change status of student
// {
    // "status":"completed",
// "courseId":"",

// }
router.post('/setCourseStatus/:learner',async function (req, res) {
    console.log("Got a POST request for /learner status update ="+JSON.stringify(req.body));
    
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
       db.collection("learner").updateMany({username:req.params.learner,"courses.courseId":req.body.courseId},{$set: {"courses.$.status":req.body.status}}).catch(error => console.log('errror', error));
       res.send("status update done!")
     })
})
// update attemptNo
router.post('/setCourseAttempt/:learner',async function (req, res) {
    console.log("Got a POST request for /learner status update ="+JSON.stringify(req.body));
    
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
       db.collection("learner").updateMany({username:req.params.learner,"courses.courseId":req.body.courseId},{$set: {"courses.$.attemptNo":req.body.attemptNo}}).catch(error => console.log('errror', error));
       res.send("attemptNo update done!")
     })
})

// get attempt
router.get('/courseAttempt/:courseId/learner/:learner',async function (req, res) {
    console.log("Got a GET request attempt ="+req.params.courseId);
    mongoClient.connect(function (err, client) {
       const db = client.db(dbName);
      db.collection("learner").aggregate([{$match:{'username':req.params.learner}}, 
      {
                         $project: {
                             "courses": {
                                 $filter: {
                                     input: "$courses",
                                     as: "course",
                                     cond: {$eq: ["$$course.courseId",ObjectId(req.params.courseId)]}
                                 }
                             },
                         }
     }
    ])
    .project( {"username":0,"password":0 , _id:0})
          .toArray(function (err, data) {
         if (err) throw err;
         console.log(data[0].courses[0]);
         res.send(data[0].courses[0]);
       })
    })
    
    })

// allow reattempts
router.post('/UpdateAssignmentsReattempt/:courseId/learner/:learner',async function (req, res) {
    console.log("Got a GET request assessment done update ="+JSON.stringify(req.body.done)," ", req.params.courseId," ",req.params.learner);
    mongoClient.connect(function (err, client) {
       const db = client.db(dbName);
      db.collection("learner").updateMany({username:req.params.learner,"courses.courseId":ObjectId(req.params.courseId)},{$set: {"courses.$.assessmentsDone":[]}}).catch(error => console.log('errror', error));
      res.send("update done!")
    })
    
})

router.post('/addNewCourseToLearner',async function (req, res) {
    console.log(req.body)
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
        db.collection("learner").findOneAndUpdate({username: req.body.id}, {$push: {"courses":{
            courseId: ObjectId(req.body.courseId),
            status: "enrolled",
            progress: 0,
            score: 0,
            attemptNo: 0,
            assessmentsDone: []
        }}})
    })
    return res.json("added new course to learner")
})
    
router.use(express.json());

module.exports=router