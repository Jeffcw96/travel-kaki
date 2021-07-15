
import Vue from 'vue'
export default function auth(http) {
    const state = {
        validationMessage: {}
    }

    const getters = {
        getValidationMessage(state) {
            return state.validationMessage
        },
        isValid(state) {
            return Object.values(state.validationMessage).every(element => { return element.length === 0 })
        }
    }

    const mutations = {
        updateValidation(state, value) {
            Vue.set(state.validationMessage, value.key, value.value)
        },

        resetValidation(state) {
            state.validationMessage = {}
        },
    }

    const actions = {
        async updateValidation({ commit, state }, val) {
            commit("updateValidation", val)
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
