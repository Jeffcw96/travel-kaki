import Vue from 'vue'
import { HerokuProxy, GoogleEndPoint, APIKey } from '@/enum/common'
export default function user(http) {
    const state = {
        origin: {},
        destination: {},
        places:[],
        markers:[],
        originAddress: "",
        destinationAddress: "",
    }

    const getters = {
        getOriginPos(state) {
            return state.position.origin
        },
        getDestinationPos(state) {
            return state.position.destination
        },
        getAddresses(state) {
            return { originAddress: state.originAddress, destinationAddress: state.destinationAddress }
        },
        getPlaces(state){
            console.log("state place",state.places)
            return state.places
        }
    }

    const mutations = {
        updatePosition(state, { refLabel, lat, lng, placeId, address }) {
            for (const [key, _] of Object.entries(state)) {
                if (key === refLabel) {
                    Vue.set(state[key], 'placeId', placeId)
                    Vue.set(state[key], 'lat', lat)
                    Vue.set(state[key], 'lng', lng)
                }
            }
        },
        setProfile(state, data) {
            state.profile = data
        },

        setPlaces(state,place){
            state.places.push(place)
        },

        setMarkers(state,markers){
            state.markers = markers
        }
    }

    const actions = {
        async findDistance({ commit, state }) {
            return await http.get(`http://localhost:3000/api/finddistance?originPlaceId=${state.origin.placeId}&destinationPlaceId=${state.destination.placeId}`)
        },

        async nearby({ commit }, { locationsGeometry, radius: radius = 1000 }) {
            const jsonObj = {}
            jsonObj.locationsGeometry = locationsGeometry
            jsonObj.type = "restaurant"
            jsonObj.radius = radius
            return await http.post('http://localhost:3000/api/nearby', jsonObj)
        },

        async placeDetails({ commit }, { placeId }) {
            return await http.get(`http://localhost:3000/api/placedetail?placeId=${placeId}`)
        },

        async getGithubProfileDetail({ commit }, data) {
            const profileDetails = await http.get('https://api.github.com/users/jeffcw96');
            commit("setProfile", profileDetails.data)
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