const state = {
    availableStructures: {
        'COMMAND': { type: 'COMMAND', content: '' },
    }
}

const getters = {
    availableStructures: (state) => {
        return state.availableStructures
    }
}

const actions = {}

const mutations = {}

export default {
    state,
    getters,
    actions,
    mutations,
}