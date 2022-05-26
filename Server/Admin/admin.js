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

router.get("/", function (req, res){
    res.send("In Admin")
})

//get total number of learners
router.get("/totalLearners", function (req, response){
    console.log("Request to get total learners")
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
        db.listCollections({name: 'learner'})
            .next(function(err, info) {
                if (info) {
                    db.collection("learner").count(function (err, count) {
                        if (err) throw err;
                        console.log(count.toString())
                        response.send(count.toString())
                    });
                }
                else{
                    response.send("0")
                }
            });

    });
})

//get total number of courses
router.get("/totalCourses", function (req, response){
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
        db.listCollections({name: 'course'})
            .next(function(err, info) {
                if (info) {
                    db.collection("course").count(function (err, count) {
                        if (err) throw err;
                        response.send(count.toString())
                    });
                }
                else{
                    response.send("0")
                }
            });

    });
})

//get total number of materials
router.get("/totalMaterials", function (req, response){
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
        db.listCollections({name: 'material'})
            .next(function(err, info) {
                if (info) {
                    db.collection("material").count(function (err, count) {
                        if (err) throw err;
                        response.send(count.toString())
                    });
                }
                else{
                    response.send("0")
                }
            });
    });
})

//get IDs of total unique enrolled courses
router.get("/totalEnrolled", function (req, res){
    mongoClient.connect(async function (err, client) {
        const db = client.db(dbName);
        var query = [
            {
                $project: {
                    "courses": {
                        $filter: {
                            input: "$courses",
                            as: "course",
                            cond: {$eq: ["$$course.status", "enrolled"]}
                        },
                    },
                }
            },
            { "$group": { _id: "$courses.courseId" } }

        ]
      db.collection("learner").aggregate(query)
          .toArray(function (err, items) {
          if (err) throw err;
          console.log(items);
          const mySet1 = new Set()
          for(var i = 0; i < items.length; i++) {
              console.log(i)
            for (var j=0; j<items[i]._id.length; j++){
                // console.log(j)
                console.log(items[i]._id[j])
                mySet1.add(items[i]._id[j])
              }
          }
          console.log(mySet1)
          res.send(Array.from(mySet1).length.toString())
      });
    });
})

//get number of total completed courses and thus cerificates issues
router.get("/totalCompleted", function (req, res){

    mongoClient.connect(async function (err, client) {
        const db = client.db(dbName);
        var query = [
            {
                $project: {
                    "courses": {
                        $filter: {
                            input: "$courses",
                            as: "course",
                            cond: {$eq: ["$$course.status", "completed"]}
                        }
                    },
                }
            },
            { "$group": { _id: "$courses.courseId" } }
        ]
        db.collection("learner").aggregate(query)
            .toArray(function (err, items) {
                if (err) throw err;
                console.log(items);
                const mySet1 = new Set()
                for(var i = 0; i < items.length; i++) {
                    console.log(i)
                    for (var j=0; j<items[i]._id.length; j++){
                        // console.log(j)
                        console.log(items[i]._id[j])
                        mySet1.add(items[i]._id[j])
                    }
                }
                console.log(mySet1)
                res.send(Array.from(mySet1).length.toString())
            });
    });
})

router.get("/enrolledCourseLearners/courseId/:courseId", function(req, res){
    var courseId=req.params.courseId
    mongoClient.connect(async function (err, client) {
        const db = client.db(dbName);
        var query = [
            {$match:{_id : ObjectId(courseId)}},
            {
                $lookup:
                    {
                        from: "learner",
                        let: {courseId:"$_id"},
                        pipeline:[
                            {
                                $unwind: '$courses',
                            },
                            {$match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$courses.courseId', '$$courseId']},
                                        { $eq: ['$courses.status', 'enrolled']},
                                    ],
                                },
                            },},
                            {
                                $group: {
                                    _id: '$_id',
                                    courses: {
                                        $first: '$courses'
                                    },
                                },
                            },
                        ],
                        as: "learnerDetails"
                    }
            }
        ]
        db.collection("course").aggregate(query)
            .toArray(function (err, items) {
                if (err) throw err;
                console.log(items);
                res.send(items)
            });
    });
})

router.get("/startedCourseLearners/courseId/:courseId", function(req, res){
    var courseId=req.params.courseId
    mongoClient.connect(async function (err, client) {
        const db = client.db(dbName);
        var query = [
            {$match:{_id : ObjectId(courseId)}},
            {
                $lookup:
                    {
                        from: "learner",
                        let: {courseId:"$_id"},
                        pipeline:[
                            {
                                $unwind: '$courses',
                            },
                            {$match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$courses.courseId', '$$courseId']},
                                            { $lt: ['$courses.progress', 50]},
                                        ],
                                    },
                                },},
                            {
                                $group: {
                                    _id: '$_id',
                                    courses: {
                                        $first: '$courses'
                                    },
                                },
                            },
                        ],
                        as: "learnerDetails"
                    }
            }
        ]
        db.collection("course").aggregate(query)
            .toArray(function (err, items) {
                if (err) throw err;
                console.log(items);
                res.send(items)
            });
    });
})

router.get("/halfCourseLearners/courseId/:courseId", function(req, res){
    var courseId=req.params.courseId
    mongoClient.connect(async function (err, client) {
        const db = client.db(dbName);
        var query = [
            {$match:{_id : ObjectId(courseId)}},
            {
                $lookup:
                    {
                        from: "learner",
                        let: {courseId:"$_id"},
                        pipeline:[
                            {
                                $unwind: '$courses',
                            },
                            {$match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$courses.courseId', '$$courseId']},
                                            { $gte: ['$courses.progress', 50]},
                                        ],
                                    },
                                },},
                            {
                                $group: {
                                    _id: '$_id',
                                    courses: {
                                        $first: '$courses'
                                    },
                                },
                            },
                        ],
                        as: "learnerDetails"
                    }
            }
        ]
        db.collection("course").aggregate(query)
            .toArray(function (err, items) {
                if (err) throw err;
                console.log(items);
                res.send(items)
            });
    });
})

router.get("/passCourseLearners/courseId/:courseId", function(req, res){
    var courseId=req.params.courseId
    mongoClient.connect(async function (err, client) {
        const db = client.db(dbName);
        var query = [
            {$match:{_id : ObjectId(courseId)}},
            {
                $lookup:
                    {
                        from: "learner",
                        let: {courseId:"$_id"},
                        pipeline:[
                            {
                                $unwind: '$courses',
                            },
                            {$match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$courses.courseId', '$$courseId']},
                                            { $eq: ['$courses.status', "completed"]},
                                        ],
                                    },
                                },},
                            {
                                $group: {
                                    _id: '$_id',
                                    courses: {
                                        $first: '$courses'
                                    },
                                },
                            },
                        ],
                        as: "learnerDetails"
                    }
            }
        ]
        db.collection("course").aggregate(query)
            .toArray(function (err, items) {
                if (err) throw err;
                console.log(items);
                res.send(items)
            });
    });
})

router.get("/failCourseLearners/courseId/:courseId", function(req, res){
    var courseId=req.params.courseId
    mongoClient.connect(async function (err, client) {
        const db = client.db(dbName);
        var query = [
            {$match:{_id : ObjectId(courseId)}},
            {
                $lookup:
                    {
                        from: "learner",
                        let: {courseId:"$_id"},
                        pipeline:[
                            {
                                $unwind: '$courses',
                            },
                            {$match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$courses.courseId', '$$courseId']},
                                            { $eq: ['$courses.status', "failed"]},
                                        ],
                                    },
                                },},
                            {
                                $group: {
                                    _id: '$_id',
                                    courses: {
                                        $first: '$courses'
                                    },
                                },
                            },
                        ],
                        as: "learnerDetails"
                    }
            }
        ]
        db.collection("course").aggregate(query)
            .toArray(function (err, items) {
                if (err) throw err;
                console.log(items);
                res.send(items)
            });
    });
})

router.get("/allCourses", function (req, res){
    console.log("Getting all courses")
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
        db.collection("course").find({})
            .project({name:1})
            .toArray(
                function(err, info) {
                    if (err) throw err;
                    console.log(info)
                    res.send(info)
            });

    });
})

router.get("/allFullCourses", function (req, res){
    console.log("Getting all courses")
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
        db.collection("course").find({})
            .toArray(
                function(err, info) {
                    if (err) throw err;
                    console.log(info)
                    res.send(info)
                });

    });
})

router.get("/allLearners", function (req, res){
    console.log("Getting all Learners")
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
        db.collection("learner").find({})
            .toArray(
                function(err, info) {
                    if (err) throw err;
                    // console.log(info)
                    res.send(info)
                });

    });
})

//to be used to add enroll or un-enroll a learner from a course
router.get("/updateLearner", function(req, res){
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
        let docId=new ObjectId(req.body._id)
        console.log(docId)
        delete req.body['_id']
        db.collection("learner")
            .updateOne({
                    _id: docId
                }, {
                    $set: req.body
                },
                function (err, result){
                    if (err) throw err;
                    console.log("Document Updated");
                    res.send(result)
                })
    });
})

//to be used to edit something in course or add/remove material or assignment
router.get("/updateCourse", function(req, res){
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
        let docId=new ObjectId(req.body._id)
        console.log(docId)
        delete req.body['_id']
        db.collection("course")
            .updateOne({
                    _id: docId
                }, {
                    $set: req.body
                },
                function (err, result){
                    if (err) throw err;
                    console.log("Document Updated");
                    res.send(result)
                })
    });
})

router.get("/getCourse/:courseId", function(req, res){
    console.log("Getting course ", req.params.courseId)
    let docId=new ObjectId(req.params.courseId)
    mongoClient.connect(function (err, client) {
        const db = client.db(dbName);
        console.log(docId)
        db.collection("course").find({_id:docId})
            .toArray(
                function(err, info) {
                    if (err) throw err;
                    console.log(info)
                    res.send(info)
                });

    });
})

router.use(express.json());

module.exports=router