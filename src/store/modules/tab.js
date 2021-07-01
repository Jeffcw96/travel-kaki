import Vue from 'vue'
import { Tabs } from "@/enum/common"
export default function tab() {
    const state = {
        activeTab: Tabs.multilocation
    }

    const getters = {
        getActiveTab(state) {
            return state.activeTab
        }
    }

    const mutations = {
        setActive(state, value) {
            state.activeTab = value
        }
    }

    const actions = {
        async setActive({ commit, state }, val) {
            commit("setActive", val)
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
