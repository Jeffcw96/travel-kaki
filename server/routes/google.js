const express = require('express')
const router = express.Router()
const axios = require('axios')
const NearBy = require("../controller/nearby")
const GoogleAPI = require("../controller/googleApi")
const SKIP = undefined
router.post("/nearby", async (req, res) => {
    try {
        const { locationsGeometry, type, rating } = req.body
        const nearBySearvice = new NearBy(locationsGeometry, "", type, rating)
        const queryResults = await nearBySearvice.findPlacesByLocations()
        const [shops, nextPageTokens] = nearBySearvice.cleanUpResponseResults(queryResults)
        const result = nearBySearvice.filterShopsBy2DArray(shops)
        res.json({ shops: result, moreShops: nextPageTokens })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("SERVER ERROR")
    }
})

router.post("/placesNearMe", async (req, res) => {
    try {
        const { address, type, radius } = req.body
        const googleAPIService = new GoogleAPI()
        let [shops, nextPageTokens, URL] = await googleAPIService.nearBySearch({ lat: address.lat, lng: address.lng, type, radius })
        console.log("shop length", shops.length)
        if (nextPageTokens && URL) {
            const moreShops = await googleAPIService.handleNextPageQueryEnd(nextPageTokens, URL)
            shops.push(moreShops)
        }

        shops = shops.flat(Infinity)

        // async function nextTokenRequest(token) {
        //     try {
        //         const nextPageURL = `${URL}&pagetoken=${token}`;
        //         const result = await axios.get(nextPageURL)
        //         shops.push(result.data.results)
        //         if (result.data.next_page_token) {
        //             nextTokenRequest(result.data.next_page_token)
        //         }
        //     } catch (error) {
        //         console.error(error.message)
        //     }
        // }

        // if (result.data.next_page_token) {
        //     await nextTokenRequest(result.data.next_page_token)
        //     res.json({ shops: shops.flat(Infinity) })
        // } else {
        //     res.json({ shops: shops.flat(Infinity) })
        // }

        res.json({ shops })

    } catch (error) {
        console.error(error.message)
        res.status(500).send('SERVER ERROR')
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

router.post('/placeImage', async (req, res) => {
    try {
        console.log("place image api")
        const { imageUrl } = req.body
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        let base64Image = Buffer.from(response.data, 'binary').toString('base64')
        res.json({ url: `data:${response.headers['content-type'].toLowerCase()};base64,${base64Image}` })

    } catch (error) {
        console.error(error.message)

        res.status(500).send('SERVER ERROR')
    }
})

module.exports = router
