var dbDef = require('./dbDef.js'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Log = require('./Log.js'),
    Config = require('./config.json'),
    app = express(),
    TestData = require('./testdata.json');
    http = require('http').createServer(app);


http.listen(Config.apiPort, function () {
    Log.info("GeoChallenger Server runs on port: " + Config.apiPort)
});

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Auth');
    next();
};
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(allowCrossDomain);
var testdata = new  dbDef.Challenge(TestData);
testdata.save();
console.log(TestData);
/**
 * get information for the challenges
 */
app.get('/challenge', function (req, res) {
    dbDef.Challenge.aggregate([{
        $project: {
            title: 1,
            price: 1,
            challengeId: 1,
            startLocationDescription: 1,
            startDate: 1,
            approxDuration: 1,
            minParticipants: 1,
            finishedBy: 1,
            numberOfQuests: {$size: "$quests"},
            numberOfParticipants: {$size: "$participants"},
            _id: 0
        }
    }], function (err, challenges) {
        if (err || challenges == null){
            Log.debug("can't get challenges", err);
            return res.status(404).send({error: "can't get challenges"});
        }
        return res.status(200).send(challenges);
    });
});

/**
 * get one Challenge by challengeId
 */
app.get('/challenge/:id', function (req, res) {
    dbDef.Challenge.findOne({challengeId: req.params.id}).select({
        _id: 0,
        __v: 0,
        pingHistory: 0
    }).exec(function (err, challenge) {
        if (err){
            Log.debug("Find challengeId error");
            return res.status(404).send({error: "Find challengeId error"});
        }
        return res.status(200).send(challenge);
    });
});

/**
 * add a challenge
 */
app.post('/challenge', function (req, res) {
    var newChallenge = req.body;
    if (!newChallenge.hasOwnProperty("challengeId")) {
        Log.debug("can't add empty challenge");
        return res.status(404).send({error: "can't add empty challenge"});
    }
    var challenge = new dbDef.Challenge(newChallenge);
    challenge.save(function (err, challenge) {
        if (err){
            Log.debug("can't add challenge");
            return res.status(404).send({error: "can't add challenge"});
        }
        return res.status(200).send({success: true});
    })
});