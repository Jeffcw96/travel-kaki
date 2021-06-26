const express = require('express')
const router = express.Router()
const axios = require('axios')

router.post("/nearby", async (req, res) => {
    try {
        const { locationsGeometry, type, rating } = req.body
        const promises = []
        for (let geometry of locationsGeometry) {
            const URL = `${process.env.GoogleEndPoint}/place/nearbysearch/json?location=${geometry.lat},${geometry.lng}&type=${type}&radius=${geometry.radius}&key=${process.env.APIKey}&opennow&rankby=prominence`;
            promises.push(axios.get(URL))
        }

        const results = await Promise.all(promises)
        const shopsArr = []
        const moreShops = []
        for (let result of results) {
            if (result.data.next_page_token) {
                moreShops.push(result.data.next_page_token)
            }
            shopsArr.push(result.data.results)
        }
        // shopsArr.forEach(shops => {
        //     shops.forEach(shop => {
        //         console.log(shop.place_id)
        //     })
        // })


        const combinedArray = []
        shopsArr.forEach(shops => {
            shops.forEach(shop => {
                const x = combinedArray.find(item => item.place_id === shop.place_id);
                if (!x) {
                    const placeObj = {}
                    placeObj.place_id = shop.place_id
                    placeObj.geometry = shop.geometry
                    placeObj.rating = shop.rating
                    placeObj.name = shop.name
                    placeObj.vicinity = shop.vicinity
                    combinedArray.push(placeObj)
                }
            })
        })


        // const filteredArr = combinedArray.reduce((acc, current) => {
        //     const x = acc.find(item => item.place_id === current.place_id);
        //     if (!x) {
        //         return acc.concat([current]);
        //     } else {
        //         return acc;
        //     }
        // }, []);

        res.json({ shops: combinedArray, moreShops: moreShops })

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