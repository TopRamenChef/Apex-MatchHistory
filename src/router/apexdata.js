//Page for getting spoofed match data
const express = require('express')
const randInt = require('../utils/randint')
require('../db/mongoose')

const axios = require('axios')
const Match = require('../db/models/match')
const { ObjectID } = require('bson')

const router = new express.Router()

//Return a match. Make up a new match with this id if there isn't one. (Query: token)
router.get('/data', async (req, res) => {
    axios.get('https://r5-pc.stryder.respawn.com/privatematch/?token='+req.query.token).then(async (response) => {
        const match = response.data.matches[0]
        const data = new Match({
            match_start: match.match_start,
            player_results: match.player_results
        })
        await data.save()
        res.send(data)
    })
})


router.get('/data/random', async (req, res) => {
    let data = await Match.findOne({match_start: req.query.time})

    if(!data){
        console.log("Did not find match")
        //Generate a match
        let player_results = []
        const teams = randInt(10)
        for(var i=1;i<=teams;i++) {
            var players = Math.floor(randInt(3))
            for(var j=1;j<=players;j++) {
                player_results.push({
                    kills: randInt(9),
                    survivalTime: randInt(1200),
                    damageDealt: randInt(1000),
                    teamName: "Team "+String(i),
                    assists: randInt(5)
                })
            }
        }

        data = new Match({
            _id: new ObjectID(),
            match_start: req.query.time,
            player_results
        })

        await data.save()
        console.log(data.match_start)
    }

    res.send(data)
})

//Randomize player stats (Query: time)
router.get('/data/randomize', async (req, res) => {
    const data = await Match.findOne({match_start: req.query.time})
    const id = data._id

    if(!data) return res.status(404).send()

    data.player_results.forEach((player) => {
        player.kills = randInt(9)
        player.survivalTime = randInt(1200),
        player.damageDealt = randInt(1000),
        player.assists = randInt(5)
    })

    await Match.findByIdAndUpdate({_id: id}, data)

    await data.save()

    res.send(data)
})

//Aggregate data (Queries: sortBy and time)
router.get('/leaderboard', async (req, res) => {
    const sortBy = req.query.sortBy
    const data = await Match.findOne({match_start: req.query.time})

    if(!data) return res.status(404).send()

    const leaderboard = {"leaderboard": []}
    switch(sortBy){
        case "Kills":
            break
        case "Damage":
            break
        //Default: Sort by Team Kills (Kill Leader)
        default:
            data.player_results.forEach((player) => {
                const team_index = leaderboard.leaderboard.findIndex((team) => {
                    return (team.teamName === player.teamName)
                })
                if (team_index == -1){
                    const newteam = {
                        teamName : player.teamName,
                        kills: player.kills,
                        damageDealt: player.damageDealt
                    }
                    leaderboard.leaderboard.push(newteam)
                } else {
                    leaderboard.leaderboard[team_index].kills += player.kills
                    leaderboard.leaderboard[team_index].damageDealt += player.damageDealt
                }
            })
            leaderboard.leaderboard.sort((a,b) => a.kills < b.kills ? 1 : a.damageDealt < b.damageDealt ? 1: -1)
    }

    const json = JSON.stringify(leaderboard)
    console.log(json)
    res.send(json)
})

module.exports = router