const express = require('express')
const router = express.Router()
const axios = require('axios')

router.post("/nearby", async (req, res) => {
    try {
        const { locationsGeometry, type, radius } = req.body
        const promises = []
        for (let geometry of locationsGeometry) {
            const URL = `${process.env.GoogleEndPoint}/place/nearbysearch/json?location=${geometry.lat},${geometry.lng}&type=${type}&radius=${radius}&key=${process.env.APIKey}&opennow&rankby=prominence`;
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





router.get("/placedetail", async (req, res) => {
    try {
        const { placeId } = req.query
        const URL = `${process.env.GoogleEndPoint}/place/details/json?key=${process.env.APIKey}&place_id=${placeId}`;
        const result = await axios.get(URL);
        res.json(result.data)


    } catch (error) {
        console.error(error.message)
        res.status(500).send('SERVER ERROR')
    }
})

router.get('/finddistance', async (req, res) => {
    try {
        console.log("find distance")
        const { originPlaceId, destinationPlaceId } = req.query
        const URL = `${process.env.GoogleEndPoint}/distancematrix/json?origins=place_id:${originPlaceId}&destinations=place_id:${destinationPlaceId}&key=${process.env.APIKey}`
        const result = await axios.get(URL);
        console.log(result.status)
        res.json({ result: result.data })

    } catch (error) {
        console.error(error.message)

        res.status(500).send('SERVER ERROR')
    }
})

module.exports = router