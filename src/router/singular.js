//Pages that show the example data as if it were "lives"

const express = require('express')

const router = new express.Router()

//Home page
router.get('', (req, res) => {
    res.render('index')
})


module.exports = router