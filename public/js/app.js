const button = document.querySelector("#refreshButton")
const updateButton = document.querySelector("#updateButton")
const sortButton = document.querySelector("#sortButton")
const groupButton = document.querySelector("#groupButton")
const randomButton = document.querySelector("#randomButton")

const rawdata = document.querySelector("#raw-data")
const teamName = document.querySelector("#team-name")
const teamKills = document.querySelector("#team-kills")
const teamDamage = document.querySelector("#team-damage")
const form = document.querySelector('#form-get-data')
const input = document.querySelector('#form-url')

let curr_match = -1
let sort = "kills"
let group_teams = true

getLeaderboard = () => {
    fetch('/leaderboard?time='+curr_match + '&sort=' + sort + '&groupTeams=' + group_teams).then((response) => {
        response.json().then((data) => {
            // console.log(data.leaderboard)
            teamKills.innerHTML = "<span><p>Kills</p></span>"
            teamDamage.innerHTML = "<span><p>Damage Dealt</p></span>"
            if (group_teams) {
                teamName.innerHTML = "<span><p>Team</p></span>"
                for (var i=0;i<data.leaderboard.length;i++){
                    teamName.insertAdjacentHTML('beforeend','<div><span><p>' + data.leaderboard[i].teamName + '</p></span></div>')
                    teamKills.insertAdjacentHTML('beforeend','<div><span><p>' + data.leaderboard[i].kills + '</p></span></div>')
                    teamDamage.insertAdjacentHTML('beforeend','<div><span><p>' + data.leaderboard[i].damageDealt + '</p></span></div>')
                }
            } else {
                teamName.innerHTML = "<span><p>Player</p></span>"
                for (var i=0;i<data.leaderboard.length;i++){
                    teamName.insertAdjacentHTML('beforeend','<div><span><p>' + data.leaderboard[i].playerName + '</p></span></div>')
                    teamKills.insertAdjacentHTML('beforeend','<div><span><p>' + data.leaderboard[i].kills + '</p></span></div>')
                    teamDamage.insertAdjacentHTML('beforeend','<div><span><p>' + data.leaderboard[i].damageDealt + '</p></span></div>')
                }
            }
        })
    })
}

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    console.log(input.value)
    fetch('/data?url=' + input.value).then((response) => {
        response.json().then((data) => {
            rawdata.innerHTML = JSON.stringify(data)
            curr_match = data.match_start
            console.log(curr_match)
            getLeaderboard()
        })
    })
})

sortButton.addEventListener('click', () => {
    if (sort === "kills") sort = "damage"
    else sort = "kills"
    sortButton.innerHTML = "Sort: " + sort
    getLeaderboard()
})

groupButton.addEventListener('click', () => {
    group_teams = !group_teams
    if (group_teams) groupButton.innerHTML = "Show: Teams"
    else groupButton.innerHTML = "Show: Players"
    getLeaderboard()
})

randomButton.addEventListener('click', async () => {
    fetch('/data/random?time=' + String(new Date().getTime())).then((response) => {
        response.json().then((data) => {
            console.log(data)
            rawdata.innerHTML = JSON.stringify(data)
            curr_match = data.match_start
            console.log(curr_match)
            getLeaderboard()
        })
    })
})

// updateButton.addEventListener('click', async () => {
//     fetch('/data/randomize?time='+curr_match).then((response) => {
//         response.json().then((data) => {
//             console.log(data)
//             rawdata.innerHTML = JSON.stringify(data)
//             getLeaderboard()
//         })
//     })
// })