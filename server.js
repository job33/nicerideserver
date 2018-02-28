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
        console.log("App now running on port, port");
    });
});

//---

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

/* "/rides"
 * GET: finnur öll rides
 * POST: býr til nýtt ride
 */
app.get("/rides", function(req, res) {

});

app.post("/rides", function(req,res) {
    var newRide = req.body;
    newRide.createDate = new Date();

    if (!(req.body.rideFrom && req.body.rideTo && req.body.date && req.body.depTime && req.body.seatsAvailable && req.body.cost)) {
        handleError(res, "Invalid user input", "Must provide all information.", 400);
    }

    db.collection(RIDES_COLLECTION).insertOne(newRide, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new ride.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

/* "/rides/:id"
 * GET: finnur ride eftir id
 * PUT: uppfærir ride eftir id
 * DELETE: eyðir ride eftir id
 */
app.get("contacts/:id", function(req, res) {

});

app.put("contacts/:id", function(req, res) {

});

app.delete("contacts/:id", function(req, res) {

});