const axios = require("axios")
class GoogleApi {
    constructor() { }

    async nearBySearch({ lat, lng, type = "restaurant", radius = "5000" }) {
        if (!lat || !lng) {
            throw new Error("LATTITUDE OR LONGTITUDE NOT FOUND")
        }
        const URL = `${process.env.GoogleEndPoint}/place/nearbysearch/json?location=${lat},${lng}&type=${type}&radius=${radius}&key=${process.env.APIKey}&opennow&rankby=prominence`;
        const queryResult = await axios.get(URL);
        return [queryResult.data.results, queryResult.data.next_page_token, URL]
    }

    async handleNextPageQueryOnce(pageToken, queryURL) {
        if (!pageToken || !queryURL) {
            throw new Error("PAGETOKEN OR URL NOT FOUND")
        }
        const URL = `${queryURL}&pagetoken=${pageToken}`
        const queryResult = await axios.get(URL)
        return queryResult.data.results
    }

    async handleNextPageQueryEnd(pageToken, queryURL) {
        if (!pageToken || !queryURL) {
            throw new Error("PAGETOKEN OR URL NOT FOUND")
        }
        let results = []
        const URL = `${queryURL}&pagetoken=${pageToken}`
        const queryResult = await axios.get(URL)
        results.push(queryResult.data.results)
        if (queryResult.data.next_page_token) {
            await handleNextPageQueryEnd(queryResult.data.next_page_token)
        }
        return results
    }
}

module.exports = GoogleApi