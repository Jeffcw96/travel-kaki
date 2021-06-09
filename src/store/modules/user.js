import Vue from 'vue'
import { HerokuProxy, GoogleEndPoint, APIKey } from '@/enum/common'
export default function user(http) {
    const state = {
        origin: {},
        destination: {},
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
        }
    }

    const actions = {
        async findDistance({ commit, state }) {
            const URL = HerokuProxy + GoogleEndPoint + `/distancematrix/json?origins=place_id:${state.origin.placeId}&destinations=place_id:${state.destination.placeId}&key=${APIKey}`
            const jsonBody = { originPlaceId: state.origin.placeId, destinationPlaceId: state.destination.placeId }
            const result = await http.post("http://localhost:3000/test", jsonBody)
            console.log("result", result)
            return http.get(URL)



        },

        async getGithubProfileDetail({ commit }, data) {
            const profileDetails = await http.get('https://api.github.com/users/jeffcw96');
            commit("setProfile", profileDetails.data)
        }
    }

    return {
        namespaced: true,
        state,
        getters,
        mutations,
        actions
    }

}