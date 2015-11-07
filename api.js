var dbDef = require('./dbDef.js'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Log = require('./Log.js'),
    Config = require('./config.json'),
    app = express(),
    http = require('http').createServer(app);


var testdaten = new dbDef.Challenge({
        title: "Schitzeljagd I",
        challengeId: "schinteljagd_1",
        startLocationDescription: "Königsstraße",
        startDate: "2015-11-06T20:29:12.485Z",
        approxDuration: "5h",
        minParticipants: 5,
        finishedBy: "12345",
        participants: [
            "12345",
            "123456"
        ]
    }
);
testdaten.save();


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
        __v: 0
    }).exec(function (err, challenge) {
        if (err || challenge != 'Object'){
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