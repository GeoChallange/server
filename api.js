var dbDef = require('./dbDef.js'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Log = require('./Log.js'),
    Config = require('./config.json'),
    app = express(),
    http = require('http').createServer(app);

app.set('port', (process.env.PORT || 5000));
http.listen(app.get('port'), function () {
    Log.info("GeoChallenger Server runs on port: " + app.get('port'))
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
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json());
app.use(allowCrossDomain);

/**
 * get information for all active challenges
 */
app.get('/challenge', function (req, res) {
    dbDef.Challenge.aggregate([
        {
            $match: {
                "finishedBy": null
            }
        }, {
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
                _id: 1
            }
        }], function (err, challenges) {
        if (err || challenges == null) {
            Log.debug("can't get challenges", err);
            return res.status(404).send({error: "can't get challenges"});
        }
        return res.status(200).send(challenges);
    });
});

/**
 * get information for all challenges
 */
app.get('/challenge/all', function (req, res) {
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
            _id: 1
        }
    }], function (err, challenges) {
        if (err || challenges == null) {
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
    dbDef.Challenge.findOne({_id: req.params.id}).select({
        __v: 0,
        pingHistory: 0
    }).exec(function (err, challenge) {
        if (err) {
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
    console.log(newChallenge);
    if (!newChallenge.hasOwnProperty("title")) {
        Log.debug("can't add empty challenge");
        return res.status(404).send({error: "can't add empty challenge"});
    }
    var challenge = new dbDef.Challenge(newChallenge);
    challenge.save(function (err, challenge) {
        if (err) {
            Log.debug("can't add challenge");
            return res.status(404).send({error: "can't add challenge"});
        }
        return res.status(201).send({success: true});
    })
});