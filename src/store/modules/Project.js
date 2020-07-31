import { EventBus } from '../../assets/js/event-bus'
import Dialog from '../../assets/js/dialog'
import TabStruct from '../../classes/TabStruct'
import { promises as fs } from 'fs'
import path from 'path'

const cloneDeep = require('lodash.clonedeep')

const state = {
    activeUUID: null,
    tabs: [],
}

const getters = {

    tabHandles: (state) => {
        let handles = []

        for (const tab of state.tabs)
        {
            handles.push({
                name: tab.meta.name,
                saved: tab.historyPosition == tab.savePosition,
                UUID: tab.UUID
            })
        }

        return handles
    },

    activeIndex: (state) => {

        let index = false
        // get active index
        for (let i = 0; i < state.tabs.length; i++)
        {
            if(state.tabs[i].UUID === state.activeUUID)
            {
                index = i
                break
            }
        }

        return index
    },

    hasTabs: (state) => {
        return state.tabs.length > 0
    },

    activeUUID: (state) => {
        return state.activeUUID
    },

    selectedElements: (state, getters) => {
        return state.tabs[getters.activeIndex].ui.selectedStructures
    },

    docStructures: (state, getters) => {
        return state.tabs[getters.activeIndex].structures
    },
    savePath: (state, getters) => {
        return state.tabs[getters.activeIndex].meta.savePath
    },
    exportPath: (state, getters) => {
        return state.tabs[getters.activeIndex].meta.exportPath
    },
    history: (state, getters) => {
        return state.tabs[getters.activeIndex].history
    },
    historyPosition: (state, getters) => {
        return state.tabs[getters.activeIndex].historyPosition
    },
    savePosition: (state, getters) => {
        return state.tabs[getters.activeIndex].savePosition
    },
    debugDOC: (state, getters) => {
        return state.tabs[getters.activeIndex]
    },
}

const actions = {

    //////////
    // Tabs //
    //////////

    addTab({ commit, dispatch }, payload) {
        const uuid = require('uuid').v4()
        let tab = new TabStruct(uuid).getStruct()

        commit('addTabs_', [tab])

        if( payload.selectOnCreation )
        {
            dispatch('selectTab', uuid)
        }
    },

    deleteTab({ commit, state, dispatch }, payload) {
        let index = false

        for (let i = 0; i < state.tabs.length; i++)
        {
            if( state.tabs[i].UUID === payload)
            {
                index = i
                break
            }
        }

        if( state.activeUUID === payload && state.tabs.length <= 1 )
        {
            console.log('Close App')
            commit('deleteTab_', index)
        }
        else
        {
            commit('deleteTab_', index)

            if( state.activeUUID === payload )
            {
                let newIndex = index > 0 ? index - 1 : 0
                dispatch('selectTab', state.tabs[newIndex].UUID)
            }
        }
    },

    selectTab({ commit }, payload) {

        commit('setActiveUUID_', {
            uuid: payload
        })
    },



    //////////////
    // Document //
    //////////////

    createElement({ commit, getters }, payload) {
        
        // let path = 'state.document.structures'
        // let layers = null
        const uuid = require('uuid')



        // Checks for trace
        if( !payload.hasOwnProperty('trace') ) return

        // Checks for trace
        if( !payload.hasOwnProperty('position') ) return

        // Checks for element
        if( !payload.hasOwnProperty('element') ) return



        // ToDo: check if trace is traversable



        // Deep-clones element
        payload.element = cloneDeep(payload.element)

        // Assign element UUID
        if( !payload.element.uuid )
        {
            payload.element.uuid = uuid.v4()
        }

        // Assign slot UUIDs
        if( ['switch', 'if'].includes(payload.element.type) )
        {
            for (let i = 0; i < payload.element.slots.length; i++)
            {
                if( !payload.element.slots[i].uuid )
                {
                    payload.element.slots[i].uuid = uuid.v4()
                }
            }
        }
        


        commit('insertStructure_', {
            trace: payload.trace,
            position: payload.position,
            element: payload.element,
            index: getters.activeIndex,
        })
        commit('addToHistory_', {
            action: 'add-element',
            index: getters.activeIndex,
        })
    },

    deleteElements({ commit, getters }, payload) {

        // Checks for elementUUIDs
        if( !payload.hasOwnProperty('elementUUIDs') ) return

        commit('deleteElements_', {
            elementUUIDs: payload.elementUUIDs,
            index: getters.activeIndex,
        })
        commit('addToHistory_', {
            action: 'delete-element',
            index: getters.activeIndex,
        })
    },

    setContent({ commit, getters }, payload) {

        // Checks for trace
        if( !payload.hasOwnProperty('trace') ) return

        // Checks for content
        if( !payload.hasOwnProperty('content') ) return


        
        commit('setContent_', {
            trace: payload.trace,
            content: payload.content,
            index: getters.activeIndex,
        })
        commit('addToHistory_', {
            action: 'set-content',
            index: getters.activeIndex,
        })
    },

    addSlot({ commit, getters }, payload) {

        commit('addSlot_', {
            uuid: payload,
            index: getters.activeIndex,
        })
        commit('addToHistory_', {
            action: 'add-slot',
            index: getters.activeIndex,
        })
    },

    selectElements({ commit, getters }, payload) {
        
        // Checks for uuids
        if( !payload.hasOwnProperty('uuids') ) return

        // Checks for clearPrevious
        if( !payload.hasOwnProperty('clearPrevious') ) payload.clearPrevious = true

        commit('selectElements_', {
            uuids: [...payload.uuids],
            clearPrevious: payload.clearPrevious,
            index: getters.activeIndex,
        })
    },

    deselectElements({ commit, getters }, payload) {
        
        if( !payload.uuids || payload.uuids.length === 0 )
        {
            commit('deselectElements_', {
                deselectAll: true,
                index: getters.activeIndex,
            })
        }
        else
        {
            commit('deselectElements_', {
                uuids: [...payload.uuids],
                index: getters.activeIndex,
            })
        }
    },

    undo({ commit, getters }, payload) {
        commit('undo_', {
            steps: payload.steps,
            index: getters.activeIndex,
        })
    },

    redo({ commit, getters }, payload) {
        commit('redo_', {
            steps: payload.steps,
            index: getters.activeIndex,
        })
    },



    ///////////
    // Mixes //
    ///////////

    async saveFile({ commit, state, getters }, payload) {

        if( !payload ) payload = { uuid: false, savePath: false, force: false }

        let index = getters.activeIndex

        let savePath = payload.savePath ? payload.savePath : state.tabs[index].meta.savePath

        // Execute only when no savePath is chosen or forced reselection
        if( !savePath || payload.force )
        {
            savePath = await Dialog.saveDialog()

            commit('setSavePath_', {
                index,
                savePath
            })
        }

        try
        {
            // ToDo: not only the active document
            await fs.writeFile(savePath, JSON.stringify(state.tabs[getters.activeIndex]))

            commit('setSavePosition_', {
                historyPosition: state.tabs[getters.activeIndex].historyPosition,
                index,
            })
        }
        catch(error)
        {
            console.error(error)
        }
    },

    async chooseExportPath({ commit, getters }) {
        let index = getters.activeIndex
        let exportPath = await Dialog.exportDialog()

        commit('setExportPath_', {
            index,
            exportPath,
        })
    },

    /*
    *  Payload:
    *  openPaths: Array
    *  selectionOnCreation: Boolean
    */
    async openFiles({ commit, dispatch }, payload) {
        
        let openPaths = payload.openPaths ? payload.openPaths : await Dialog.openDialog()

        for (const openPath of openPaths)
        {
            try
            {
                let uuid = require('uuid').v4()
                let content = await fs.readFile(openPath)
                // let tab = new TabStruct(uuid).getStruct()
                
                let tab = JSON.parse(content)

                tab.UUID = uuid
    
                commit('addTabs_', [tab])
    
                if( payload.selectOnCreation )
                {
                    dispatch('selectTab', uuid)
                }
            }
            catch(error) 
            {
                console.error(error)
            }
        }
    },

    // ToDo: Implement own renderer to include PNG, JPG and TEX

    exportFile({ commit, dispatch }, payload) {},

    dataUrlToFile({}, payload) {

        // Checks for format
        if( !payload.hasOwnProperty('format') ) return

        // Checks for dataUrl
        if( !payload.hasOwnProperty('dataUrl') ) return

        // Checks for path
        if( !payload.hasOwnProperty('path') ) return



        let exportToPNG = async () => {
            let dataUrl = payload.dataUrl.replace(/^data:image\/png;base64,/, '')
            await fs.writeFile(path.join(payload.path + '.png'), dataUrl, 'base64')
        }

        let exportToJPG = async () => {
            let dataUrl = payload.dataUrl.replace(/^data:image\/jpeg;base64,/, '')
            await fs.writeFile(path.join(payload.path + '.jpg'), dataUrl, 'base64')
        }



        switch (payload.format)
        {
            case 'PNG': exportToPNG(); break
            case 'JPG': exportToJPG(); break
        }

    }
}

const mutations = {

    addTabs_: (state, param) => {
        state.tabs.push( ...param )
    },

    deleteTab_: (state, param) => {
        state.tabs.splice(param, 1)
    },

    setActiveUUID_: (state, param) => {
        state.activeUUID = param.uuid
    },

    insertStructure_: (state, param) => {

        let layers = []
        let path = 'state.tabs['+param.index+'].structures'
        let location = null
        let injectPosition = 0

        
        // Trace to layers
        layers = param.trace.split('-')
        
        // Get inject position if element shall be inserted below
        if( ['below', 'above'].includes(param.position) )
        {
            injectPosition = layers.pop()
        }

        // check if trace is traverable
        for (let layer of layers)
        {
            layer = layer.split(':')
            
            if( layer[0] !== 'N' )
            {
                path += `.slots[${layer[0]}]`
            }

            if( layer[1] !== 'N' )
            {
                path += `.children[${layer[1]}]`
            }
        }

        if( ['below', 'above'].includes(param.position) )
        {
            injectPosition = injectPosition.split(':')
    
            if( injectPosition[0] !== 'N' )
            {
                path += `.slots[${injectPosition[0]}]`
            }
    
            if( injectPosition[1] !== 'N' )
            {
                injectPosition = parseInt(injectPosition[1])
            }
            else
            {
                injectPosition = 0
            }
        }


        // Evaluate it
        location = eval(path)

        // Inject routine if inserted in element
        if(param.position === 'into')
        {
            location.children.unshift(JSON.parse(JSON.stringify(param.element)))
        }

        // Inject routine if inserted below element
        else if(param.position === 'below')
        {
            location.children.splice(injectPosition+1, 0, JSON.parse(JSON.stringify(param.element)))
        }

        // Inject routine if inserted above element
        else if(param.position === 'above')
        {
            location.children.splice(injectPosition, 0, JSON.parse(JSON.stringify(param.element)))
        }
    },

    setContent_: (state, param) => {
        let layers = []
        let path = 'state.tabs['+param.index+'].structures'
        let location = null

        
        // Trace to layers
        layers = param.trace.split('-')

        // check if trace is traverable
        for (let layer of layers)
        {
            layer = layer.split(':')
            
            if( layer[0] !== 'N' )
            {
                path += `.slots[${layer[0]}]`
            }

            if( layer[1] !== 'N' )
            {
                path += `.children[${layer[1]}]`
            }
        }

        // Evaluate it
        location = eval(path)
        
        location.content = JSON.parse(JSON.stringify(param.content))
    },

    addSlot_: (state, param) => {

        let recursiveUuidSearch = (structures) => {

            for (let i = 0; i < structures.children.length; i++)
            {
                const structure = structures.children[i]

                // Checks if element has the searched uuid
                if( param.uuid === structure.uuid )
                {
                    // Adds slot
                    structure.slots.unshift({
                        children: [],
                        content: 'case',
                        uuid: require('uuid').v4()
                    })

                    // No need for further recursion because element was found
                    return
                }
                
                if( structure.hasOwnProperty('slots') )
                {
                    for (const slot of structure.slots)
                    {
                        recursiveUuidSearch(slot)
                    }
                }
    
                else if( structure.hasOwnProperty('children') )
                {
                    recursiveUuidSearch(structure)
                }
            }
        }

        recursiveUuidSearch(state.tabs[param.index].structures)
    },

    selectElements_: (state, param) => {
        if( param.clearPrevious )
        {
            state.tabs[param.index].ui.selectedStructures = []
        }

        state.tabs[param.index].ui.selectedStructures.push(...param.uuids)
    },

    deselectElements_: (state, param) => {

        if( param.deselectAll === true )
        {
            state.tabs[param.index].ui.selectedStructures = []
        }
        else
        {
            for (const uuid of param.uuids)
            {
                let i = state.tabs[param.index].ui.selectedStructures.indexOf(uuid)
    
                if( i >= 0 )
                {
                    state.tabs[param.index].ui.selectedStructures.splice(i, 1)
                }
            }
        }
    },

    deleteElements_: (state, param) => {

        /*
        *  This functions expect it's parameter "structures" to have an array named "children"
        */

        let recursiveDelete = (structures) => {

            for (let i = 0; i < structures.children.length; i++)
            {
                const structure = structures.children[i]

                // Checks if current UUID is selected to be deleted
                if( param.elementUUIDs.includes(structure.uuid) )
                {
                    // Deletes element
                    structures.children.splice(i, 1)

                    // No need for further recursion because parent element just got deleted
                    continue
                }
                
                if( structure.hasOwnProperty('slots') )
                {
                    for (let j = 0; j < structure.slots.length; j++)
                    {
                        const slot = structure.slots[j]

                        // Checks if slot is selected and if not less than two slots
                        if( param.elementUUIDs.includes(slot.uuid) && structure.slots.length > 2 )
                        {
                            structure.slots.splice(j, 1)
                        }
                        else
                        {
                            recursiveDelete(slot)
                        }
                    }
                }
    
                else if( structure.hasOwnProperty('children') )
                {
                    recursiveDelete(structure)
                }
            }
        }

        recursiveDelete(state.tabs[param.index].structures)
    },

    setSavePath_: (state, param) => {
        state.tabs[param.index].meta.savePath = param.savePath

        // Try to extract name from savePath and set it in focused tab
        try
        {
            state.tabs[param.index].meta.name = path.basename(param.savePath, path.extname(param.savePath))
        }
        catch(error)
        {
            console.error(error)
        }
    },

    setExportPath_: (state, param) => {
        state.tabs[param.index].meta.exportPath = param.exportPath
    },

    setSavePosition_: (state, param) => {
        state.tabs[param.index].savePosition = param.historyPosition
    },

    addToHistory_: (state, param) => {
        let doc = cloneDeep(state.tabs[param.index].structures)

        // If history pointer is not up to date, delete every action after the pointer
        if( state.tabs[param.index].historyPosition !== state.tabs[param.index].history.length - 1 )
        {
            state.tabs[param.index].history.splice(state.tabs[param.index].historyPosition + 1, state.tabs[param.index].history.length - state.tabs[param.index].historyPosition)
        }

        // Pushes new state into history
        state.tabs[param.index].history.push({ action: param.action, state: doc })

        // Sets history pointer
        state.tabs[param.index].historyPosition = state.tabs[param.index].history.length - 1

        // Emits document-update
        EventBus.$emit('document-update')
    },

    undo_: (state, param) => {
        if( state.tabs[param.index].historyPosition - param.steps >= 0 )
        {
            state.tabs[param.index].historyPosition -= param.steps
        }
        else
        {
            state.tabs[param.index].historyPosition = 0
        }

        try {
            state.tabs[param.index].structures = cloneDeep(state.tabs[param.index].history[state.tabs[param.index].historyPosition].state)
        }
        catch (error)
        {
            console.error(error)
        }
    },

    redo_: (state, param) => {
        if( state.tabs[param.index].historyPosition + param.steps <= state.tabs[param.index].history.length - 1 )
        {
            state.tabs[param.index].historyPosition += param.steps
        }
        else
        {
            state.tabs[param.index].historyPosition = state.tabs[param.index].history.length - 1
        }

        try {
            state.tabs[param.index].structures = cloneDeep(state.tabs[param.index].history[state.tabs[param.index].historyPosition].state)
        }
        catch (error)
        {
            console.error(error)
        }
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}