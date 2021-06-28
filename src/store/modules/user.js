import Vue from 'vue'
export default function user(http) {
    const state = {
        original_location: {},
        destination_location: {},
        configurations: {},
        places: [],
        markers: [],
        activeMarkerIndex: null,
        advancedGeometry: {
            locationsGeometry: []
        },
        originAddress: "",
        destinationAddress: "",
        currentLocation: "",
        circleRadius: 1000
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
        },
        getCircleAreaRadius(state) {
            return state.circleRadius
        },
        currentLocation(state) {
            return state.currentLocation
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
            state.places = [...state.places, ...place]
        },

        setMarkers(state, markers) {
            state.markers = [...state.markers, ...markers]
        },

        clearPlaces(state) {
            state.places = []
        },

        clearMarkers(state) {
            state.markers = []
        },


        activeMarker(state, activeIndex) {
            console.log('activeMarker 123', activeIndex)
            state.activeMarkerIndex = activeIndex
        },

        setAdvanceGeometry(state, { locationsGeometry, radius }) {
            console.log("locationsGeometry", locationsGeometry, radius)
            const processedlocationsGeometry = locationsGeometry.map((geometry) => {
                return { ...geometry, radius: radius }
            })
            Vue.set(state.advancedGeometry, "locationsGeometry", processedlocationsGeometry)
        },

        setCircleAreaRadius(state, radius) {
            state.circleRadius = radius
        },

        setCurrentLocation(state, address) {
            state.originAddress = address
            state.currentLocation = address
        }
    }

    const actions = {
        async findDistance({ commit, state }) {
            return await http.get(`/api/finddistance?originPlaceId=${state.original_location.placeId}&destinationPlaceId=${state.destination_location.placeId}`)
        },

        async nearby({ state, commit, getters }, { locationsGeometry }) {
            console.log("advance geometry", state.advancedGeometry, state.advancedGeometry.length)
            console.log('locationGeometry', locationsGeometry, locationsGeometry.length)



            const allLocationsGeometry = [...locationsGeometry, ...state.advancedGeometry.locationsGeometry]
            console.log(allLocationsGeometry)
            const jsonObj = {}
            jsonObj.locationsGeometry = allLocationsGeometry
            jsonObj.type = getters.getType
            jsonObj.rating = getters.getRating
            return await http.post('http://localhost:3000/api/nearby', jsonObj)
        },

        async placeDetails({ commit }, { placeId }) {
            return await http.get(`http://localhost:3000/api/placedetail?placeId=${placeId}`)
        },

        async getPlaceImage({ commit }, imageUrl) {
            return await http.post('http://localhost:3000/api/placeImage', { imageUrl })
        },

        async getCurrentLocation({ dispatch }) {
            const { latitude, longitude } = await currentLatAndLong();
            dispatch('getAddressByGeometry', { latitude, longitude })
        },

        async getAddressByGeometry({ commit }, params) {
            try {
                const result = await http.get(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${params.latitude},${params.longitude}&key=AIzaSyC4_m7mmLO59skzR9hyYEj1sgxKuHjtzo4`
                );
                const { formatted_address } = result.data.results[0];

                if (result.data.error_message) throw error_message;
                commit('setCurrentLocation', formatted_address)

            } catch (error) {

            }
        },

        listPlaces({ state, commit }, place) {
            commit("setPlaces", place)
        },

        listMarkers({ state, commit }, markers) {
            commit("setMarkers", markers)
        },

        resetLocation({ state, commit }) {
            commit("clearPlaces")
            commit("clearMarkers")
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

function currentLatAndLong() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (position.coords.latitude && position.coords.longitude) {
                    console.log(
                        position.coords.latitude && position.coords.longitude
                    );
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                }
            },
            (error) => {
                reject(error.message);
            },
            { enableHighAccuracy: true }
        );
    });
}