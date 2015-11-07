var Db = require('mongoose');
var challenge = Db.Schema({
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
    ],
    userIds: [
        {
            userId: String
        }
    ]
});

var Challenge = Db.model('Challenge', challenge);
Db.connect('mongodb://localhost/geochallenge');
module.exports = {
    Challenge: Challenge,
    Db: Db
};