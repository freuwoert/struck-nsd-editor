const state = {
    availableStructures: {
        'command': {
            type: 'command',
            content: 'int a = 0'
        },
        'call': {
            type: 'call',
            content: 'call()'
        },
        'break': {
            type: 'break',
            content: 'break'
        },
        'while': {
            type: 'while',
            content: 'while',
            children: []
        },
        'do-while': {
            type: 'do-while',
            content: 'do-while',
            children: []
        },
        'endless-loop': {
            type: 'endless-loop',
            content: 'endless',
            children: []
        },
        'if': {
            type: 'if',
            content: 'condition',
            slots: [
                {
                    content: 'true',
                    children: []
                },
                {
                    content: 'false',
                    children: []
                },
            ]
        },
        'switch': {
            type: 'switch',
            content: 'condition',
            slots: [
                {
                    content: '1',
                    children: []
                },
                {
                    content: '2',
                    children: []
                },
                {
                    content: 'default',
                    children: []
                },
            ]
        },
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