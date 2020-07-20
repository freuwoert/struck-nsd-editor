const state = {
    loadDelay: 1100,
    releaseNote: false,
    preloader: true,
    settings: false,
    export: false,
}

const getters = {
    loadDelay: (state) => state.loadDelay,
    releaseNoteUI: (state) => state.releaseNote,
    preloaderUI: (state) => state.preloader,
    settingsUI: (state) => state.settings,
    exportUI: (state) => state.export,
}

const actions = {

    setReleaseNoteUI({ commit }, payload)
    {
        if( [true, false].includes(payload) )
        {
            commit('setReleaseNoteUI_', payload)
        }
    },

    setPreloaderUI({ commit }, payload)
    {
        if( [true, false].includes(payload) )
        {
            commit('setPreloaderUI_', payload)
        }
    },

    setSettingsUI({ commit }, payload)
    {
        if( [true, false].includes(payload) )
        {
            commit('setSettingsUI_', payload)
        }
    },

    setExportUI({ commit }, payload)
    {
        if( [true, false].includes(payload) )
        {
            commit('setExportUI_', payload)
        }
    },
}

const mutations = {

    setReleaseNoteUI_: (state, param) => {
        state.releaseNote = param
    },

    setPreloaderUI_: (state, param) => {
        state.preloader = param
    },

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