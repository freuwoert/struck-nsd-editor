const state = {
    versionName: 'Over Engineered',
    version: require('electron').remote.app.getVersion(),
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
}

const getters = {
    allAppInfo: (state) => state,
    vAppInfo: (state) => state.version,
    vNameAppInfo: (state) => state.versionName,
    vElectronAppInfo: (state) => state.electronVersion,
    vNodeAppInfo: (state) => state.nodeVersion,
}

const actions = {}

const mutations = {}

export default {
    state,
    getters,
    actions,
    mutations,
}