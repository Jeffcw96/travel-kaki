const express = require('express')
const router = express.Router()
const axios = require('axios')

router.post("/nearby", async (req, res) => {
    try {
        const { locationsGeometry, type, radius } = req.body
        const promises = []
        for (let geometry of locationsGeometry) {
            const URL = `${process.env.GoogleEndPoint}/place/nearbysearch/json?location=${geometry.lat},${geometry.lng}&type=${type}&radius=${radius}&key=${process.env.APIKey}`;
            promises.push(axios.get(URL))
        }

        const results = await Promise.all(promises)
        const shopsArr = []
        for (let result of results) {
            shopsArr.push(result.data.results)
        }

        res.json({ shops: shopsArr })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("SERVER ERROR")
    }
})

module.exports = router