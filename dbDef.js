var Db = require('mongoose'),
    Log = require('./Log.js'),
    Config = require('./config.json'),
    challenge = Db.Schema({
    title: String,
    price: Number,
    challengeId: String,
    startLocationDescription: String,
    startDate: Date,
    approxDuration: String,
    minParticipants: Number,
    finishedBy: String,
    participants: [
        String
    ],
    quests: [
        {
            question: String,
            answer: String,
            lon: Number,
            lat: Number
        }
    ],
    pingHistory: [
        {
            userId: String,
            lon: Number,
            lat: Number,
            timestamp: Date,
            nextQuestIndex: Number
        }
    ]
});

var Challenge = Db.model('Challenge', challenge);

//Db.connect('mongodb://' + Config.dbHost + ':' + Config.dbPort +  '/geochallenge' , function(err) {
Db.connect(process.env.MONGOLAB_URI, function(err) {
    if (err) Log.error("Database connection failed", err);
    console.log("DB runs");
});

module.exports = {
    Challenge: Challenge,
    Db: Db
};