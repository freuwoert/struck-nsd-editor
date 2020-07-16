const state = {
    loadDelay: 1100,
    releaseNote: false,
    settings: false,
    export: false,
    activeSetting: 'INFO',
}

const getters = {
    GENERAL_UI: (state) => state,
    settingsUI: (state) => state.settings,
    exportUI: (state) => state.export,
    loadDelay: (state) => state.loadDelay,
}

const actions = {

    setSettingsUI({ commit }, payload) {
        if( payload === false || payload === true)
        {
            commit('setSettingsUI_', payload)
        }
    },

    setExportUI({ commit }, payload) {
        if( payload === false || payload === true)
        {
            commit('setExportUI_', payload)
        }
    },
}

const mutations = {
    setSettingsUI_: (state, param) => {
        state.settings = param
    },

    setExportUI_: (state, param) => {
        state.export = param
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}