var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var RIDES_COLLECTION = "rides";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var db;

mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  console.log("Database connection ready");

  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// rideS API ROUTES BELOW

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/rides"
 *    GET: finnur öll rides
 *    POST: býr til ride
 */

app.get("/rides", function(req, res) {
  db.collection(Rides_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get rides.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/rides", function(req, res) {
  var newride = req.body;
  newride.createDate = new Date();

  if (!(req.body.rideFrom && req.body.rideTo && req.body.date && req.body.depTime && req.body.seatsAvailable && req.body.cost)) {
    handleError(res, "Invalid user input", "Must provide all information.", 400);
  }

  db.collection(RIDES_COLLECTION).insertOne(newride, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new ride.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/rides/:id"
 *    GET: finnur ride by id
 *    PUT: uppfærir ride by id
 *    DELETE: eyðir ride by id
 */

app.get("/rides/:id", function(req, res) {
  db.collection(RIDES_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get ride");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/rides/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(RIDES_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update ride");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/rides/:id", function(req, res) {
  db.collection(RIDES_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete ride");
    } else {
      res.status(204).end();
    }
  });
});