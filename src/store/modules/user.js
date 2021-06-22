import Vue from 'vue'
export default function user(http) {
    const state = {
        original_location: {},
        destination_location: {},
        configurations: {},
        places: [],
        markers: [],
        activeMarkerIndex: null,
        originAddress: "",
        destinationAddress: "",
    }

    const getters = {
        getOriginPos(state) {
            return state.original_location
        },
        getDestinationPos(state) {
            return state.destination_location
        },
        getAddresses(state) {
            return { originAddress: state.originAddress, destinationAddress: state.destinationAddress }
        },
        getPlaces(state) {
            return state.places.flat(Infinity)
        },
        getMarkers(state) {
            return state.markers.flat(Infinity)
        },
        getRating(state) {
            return state.configurations.rating || "4.0"
        },
        getType(state) {
            return state.configurations.type || "restaurant"
        }
    }

    const mutations = {
        updatePosition(state, { fieldName, lat, lng, placeId }) {
            for (const [key, _] of Object.entries(state)) {
                if (key === fieldName) {
                    Vue.set(state[key], 'placeId', placeId)
                    Vue.set(state[key], 'lat', lat)
                    Vue.set(state[key], 'lng', lng)
                }
            }
        },
        updateConfiguration(state, { fieldName, value }) {
            console.log("fieldName", fieldName, "typeof", typeof (value))
            Vue.set(state.configurations, fieldName, value)
        },
        setProfile(state, data) {
            state.profile = data
        },

        setPlaces(state, place) {
            state.places.push(place)
        },

        setMarkers(state, markers) {
            console.log("set markers", markers)
            state.markers.push(markers)
        },

        clearPlaces(state) {
            state.places = []
        },

        clearMarkers(state) {
            state.markers = []
        },


        activeMarker(state, activeIndex) {
            console.log('activeMarker', activeIndex)
            state.activeMarkerIndex = activeIndex
        }
    }

    const actions = {
        async findDistance({ commit, state }) {
            return await http.get(`/api/finddistance?originPlaceId=${state.original_location.placeId}&destinationPlaceId=${state.destination_location.placeId}`)
        },

        async nearby({ commit, getters }, { locationsGeometry, radius: radius = 1000 }) {
            const jsonObj = {}
            jsonObj.locationsGeometry = locationsGeometry
            jsonObj.type = getters.getType
            jsonObj.radius = radius
            return await http.post('http://localhost:3000/api/nearby', jsonObj)
        },

        async placeDetails({ commit }, { placeId }) {
            return await http.get(`http://localhost:3000/api/placedetail?placeId=${placeId}`)
        },

        async getPlaceImage({ commit }, imageUrl) {
            return await http.post('http://localhost:3000/api/placeImage', { imageUrl })
        },

        listPlaces({ state, commit }, place) {
            // commit("clearPlaces")
            commit("setPlaces", place)
        },

        listMarkers({ state, commit }, markers) {
            // commit("clearMarkers")
            commit("setMarkers", markers)
        },
    }

    return {
        namespaced: true,
        state,
        getters,
        mutations,
        actions
    }

}