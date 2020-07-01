const state = {
    loadDelay: 500,
    releaseNote: false,
    settings: false,
    activeSetting: 'INFO',
}

const getters = {
    GENERAL_UI: (state) => state,
    settingsUI: (state) => state.settings,
    loadDelay: (state) => state.loadDelay,
}

const actions = {

    setSettingsUI({ commit }, payload) {
        if( payload === false || payload === true)
        {
            commit('setSettingsUI_', payload)
        }
    },
}

const mutations = {
    setSettingsUI_: (state, param) => {
        state.settings = param
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}