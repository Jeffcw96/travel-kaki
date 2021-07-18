import cookie from '@/utils/cookie'
export default function auth(http) {
    const state = {
        isLogin: false
    }

    const getters = {
        getLoginStatus(state) {
            return state.isLogin
        }
    }

    const mutations = {
        setLogin(state, value) {
            state.isLogin = value
        }
    }

    const actions = {
        async login({ commit, state }, val) {
            const result = await http.post('/user/login', val)
            if (result.data.token) {
                cookie.setCookie('token', result.data.token, 1)
                commit("setLogin", true)
            } else {
                commit("setLogin", false)
            }
        },

        async verifyUser({ commit, state }) {
            const userToken = cookie.getCookie("token")
            if (userToken) {
                const result = await http.get('/verify', {
                    headers: {
                        "Authorization": "Bearer " + cookie.getCookie("token")
                    }
                })

                if (!result.data.isValid) {
                    commit("setLogin", false)
                    return
                }
                commit("setLogin", result.data.isValid)
            }
        },

        async fireConnection() {
            await http.get("/connection")
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
