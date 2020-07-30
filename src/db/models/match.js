const mongoose = require('mongoose')

const MatchSchema = new mongoose.Schema({
    match_start: {
        type: Number,
        required: true
    },
    player_results: {
        type: Array,
        required: true
    }
})

const Match = mongoose.model('Match',MatchSchema)

module.exports = Match