import Vue from 'vue'
export default function user(http) {
    const state = {
        origin: {},
        destination: {},
    }

    const getters = {
        getOriginPos(state) {
            return state.position.origin
        },
        getDestinationPos(state) {
            return state.position.destination
        },

    }

    const mutations = {
        updatePosition(state, { refLabel, lat, lng }) {
            for (const [key, _] of Object.entries(state)) {
                if (key === refLabel) {
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
        addNumber({ commit }, data) {
            commit("setNumber", data)
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