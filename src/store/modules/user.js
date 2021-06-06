export default function user(http) {
    const state = {
        number: 15,
        profile: {}
    }

    const getters = {
        getNumber(state) {
            return state.number
        },
        getProfile(state) {
            return state.profile
        }

    }

    const mutations = {
        setNumber(state, data) {
            state.number = data
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