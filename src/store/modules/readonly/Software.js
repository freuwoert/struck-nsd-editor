const state = {
    updateName: 'Creator Update',
    appVersion: require('electron').remote.app.getVersion(),
    nodeVersion: process.versions.node,
    electronVersion: process.versions.electron,
}

const getters = {
    updateName: (state) => state.updateName,
    appVersion: (state) => state.appVersion,
    nodeVersion: (state) => state.nodeVersion,
    electronVersion: (state) => state.electronVersion,
}

const actions = {}

const mutations = {}

export default {
    state,
    getters,
    actions,
    mutations,
}