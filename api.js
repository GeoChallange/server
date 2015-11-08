var dbDef = require('./dbDef.js'),
    express = require('express'),
    bodyParser = require('body-parser'),
    Log = require('./Log.js'),
    app = express(),
    http = require('http').createServer(app);

app.set('port', (process.env.PORT || 5000));

//http.listen(8080 , function () {
http.listen(app.get('port') , function () {
    Log.info("GeoChallenger Server runs on port: ")
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.all('*', function(req, res, next){
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    if ('OPTIONS' == req.method) return res.send(200); else
    next();
});

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

/**
 * get information for all active challenges
 */
app.get('/challenge', function (req, res) {
    Log.debug("get challenge");
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
 * get challenges by userId
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
    Log.debug("get all challenge");
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
        return res.status(201).send({_id: challenge._id});
    })
});

/**
 *
 */

app.put('/challenge/:id', function (req, res) {
    var join = req.body;
    Log.debug(join);
    console.log(req.params.id);
    dbDef.Challenge.update({'_id': req.params.id}, { $push: {participants: join.userId}}, function (err, challenge) {
        Log.debug(challenge);
        if (err) {
            Log.debug("can't add challenge");
            return res.status(404).send({error: "can't add challenge"});
        }
        return res.status(200).send({success: true});
    });
});

