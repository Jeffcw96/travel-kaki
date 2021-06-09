const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
app.use(express.json());
app.use(cors())
app.post("/test", async (req, res) => {
    try {
        console.log("hello")
        const GoogleEndPoint = 'https://maps.googleapis.com/maps/api'
        const APIKEY = 'AIzaSyC4_m7mmLO59skzR9hyYEj1sgxKuHjtzo4'
        const { originPlaceId, destinationPlaceId } = req.body
        const url = GoogleEndPoint + `/distancematrix/json?origins=place_id:${originPlaceId}&destinations=place_id:${destinationPlaceId}&key=${APIKEY}`

        const result = await axios.get(url)
        res.json(result.data)


    } catch (error) {
        console.error(error.message)
        res.status(500).send("SERVER ERROR")
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => { console.log(`Server is Running at PORT ${PORT}`) })