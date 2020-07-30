const button = document.querySelector("#refreshButton")
const updateButton = document.querySelector("#updateButton")

const rawdata = document.querySelector("#raw-data")
const teamName = document.querySelector("#team-name")
const teamKills = document.querySelector("#team-kills")
const teamDamage = document.querySelector("#team-damage")
const form = document.querySelector('#form-get-data')
const input = document.querySelector('#form-url')

let curr_match = -1
let sort = ""

getLeaderboard = () => {
    fetch('/leaderboard?time='+curr_match + '&sortBy='+sort).then((response) => {
        response.json().then((data) => {
            // console.log(data.leaderboard)
            teamName.innerHTML = "<span><p>Team</p></span>"
            teamKills.innerHTML = "<span><p>Kills</p></span>"
            teamDamage.innerHTML = "<span><p>Damage Dealt</p></span>"
            for (const team in data.leaderboard){
                console.log(team)
                teamName.insertAdjacentHTML('beforeend','<div><span><p>' + data.leaderboard[team].teamName + '</p></span></div>')
                teamKills.insertAdjacentHTML('beforeend','<div><span><p>' + data.leaderboard[team].kills + '</p></span></div>')
                teamDamage.insertAdjacentHTML('beforeend','<div><span><p>' + data.leaderboard[team].damageDealt + '</p></span></div>')
            }
        })
    })
}

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    console.log(input.value)
    fetch('/data?token=' + input.value).then((response) => {
        response.json().then((data) => {
            rawdata.innerHTML = JSON.stringify(data)
            curr_match = data.match_start
            console.log(curr_match)
            getLeaderboard()
        })
    })
})

// button.addEventListener('click', async () => {
//     fetch('/data?time=' + String(new Date().getTime())).then((response) => {
//         response.json().then((data) => {
//             console.log(data)
//             rawdata.innerHTML = JSON.stringify(data)
//             curr_match = data.match_start
//             console.log(curr_match)
//             getLeaderboard()
//         })
//     })
// })

// updateButton.addEventListener('click', async () => {
//     fetch('/data/randomize?time='+curr_match).then((response) => {
//         response.json().then((data) => {
//             console.log(data)
//             rawdata.innerHTML = JSON.stringify(data)
//             getLeaderboard()
//         })
//     })
// })