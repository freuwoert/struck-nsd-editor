import { EventBus } from '../../assets/js/event-bus'
import Dialog from '../../assets/js/dialog'
import TabStruct from '../../classes/TabStruct'
import { promises as fs } from 'fs'
import path from 'path'

const cloneDeep = require('lodash.clonedeep')

const state = {
    activeUUID: null,
    history: [],
    tabs: [],
    document: new TabStruct('STARTER_UUID').getStruct()
}

const getters = {

    //////////
    // Tabs //
    //////////

    tabHandles: (state) => {
        let handles = []

        for (const tab of state.tabs)
        {
            handles.push({
                name: tab.meta.name,
                changed: tab.meta.changed,
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



    //////////////
    // Document //
    //////////////

    activeUUID: (state) => state.document.UUID,
    selectedElements: (state) => state.document.ui.selectedStructures,
    docStructures: (state) => state.document.structures,
    savePath: (state) => state.document.meta.savePath,
    exportPath: (state) => state.document.meta.exportPath,
    view: (state) => state.document.ui.view,
}

const actions = {

    //////////
    // Tabs //
    //////////

    addTab({ commit, dispatch }, payload) {
        const uuid = require('uuid').v4()
        let tab = new TabStruct(uuid).getStruct()

        if( payload.view )
        {
            tab.ui.view = payload.view
        }

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

    selectTab({ commit, state }, payload) {

        let oldIndex = false
        let newIndex = false

        for (let i = 0; i < state.tabs.length; i++)
        {
            if( !oldIndex && state.tabs[i].UUID === state.activeUUID) oldIndex = i
            if( !newIndex && state.tabs[i].UUID === payload) newIndex = i
        }

        if( oldIndex !== false )
        {
            // Saves all progress of the document module to it's counterpart in the tabs array
            commit('documentToBackground_', {
                index: oldIndex,
                data: state.document,
            })
        }

        if( newIndex !== false )
        {
            // Loads all data of a chosen tab in the tabs array into the document
            // ref: Document module
            commit('documentToForeground_', {
                data: state.tabs[newIndex],
            })
        }
    },



    //////////////
    // Document //
    //////////////

    createElement({ commit, state, getters }, payload) {
        
        // let path = 'state.document.structures'
        // let layers = null
        const uuid = require('uuid')



        // Checks for trace
        if( !payload.hasOwnProperty('trace') ) return

        // Checks for trace
        if( !payload.hasOwnProperty('position') ) return

        // Checks for element
        if( !payload.hasOwnProperty('element') ) return



        // TODO: check if trace is traversable



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
        

        
        commit('setChanged_', true)
        commit('addToHistory_', { action: 'add-element' })
        commit('setBackgroundChanged_', { index: getters.activeIndex , changed: true })
        commit('insertStructure_', {
            trace: payload.trace,
            position: payload.position,
            element: payload.element
        })
    },

    deleteElements({ commit }, payload) {

        // Checks for elementUUIDs
        if( !payload.hasOwnProperty('elementUUIDs') ) return

        commit('deleteElements_', payload)
    },

    setContent({ commit, getters }, payload) {

        // Checks for trace
        if( !payload.hasOwnProperty('trace') ) return

        // Checks for content
        if( !payload.hasOwnProperty('content') ) return


        
        commit('setChanged_', true)
        commit('setBackgroundChanged_', {index: getters.activeIndex , changed: true})
        commit('setContent_', {
            trace: payload.trace,
            content: payload.content
        })
    },

    addSlot({ commit, getters }, payload) {

        commit('setChanged_', true)
        commit('setBackgroundChanged_', {index: getters.activeIndex , changed: true})
        commit('addSlot_', {
            uuid: payload,
        })
    },

    selectElements({ commit }, payload) {
        
        // Checks for uuids
        if( !payload.hasOwnProperty('uuids') ) return

        // Checks for clearPrevious
        if( !payload.hasOwnProperty('clearPrevious') ) payload.clearPrevious = true

        commit('selectElements_', { uuids: [...payload.uuids], clearPrevious: payload.clearPrevious })
    },

    deselectElements({ commit }, payload) {
        
        if( !payload.uuids || payload.uuids.length === 0 )
        {
            commit('deselectElements_', { deselectAll: true })
        }
        else
        {
            commit('deselectElements_', { uuids: [...payload.uuids] })
        }
    },

    undo({ commit }, payload) {
        console.log('undo '+payload.steps+'x')
    },

    redo({ commit }, payload) {
        console.log('redo '+payload.steps+'x')
    },



    ///////////
    // Mixes //
    ///////////

    async saveFile({ commit, state, getters }, payload) {

        if( !payload ) payload = { uuid: false, savePath: false, force: false }

        let index = getters.activeIndex
        let uuid = payload.uuid ? payload.uuid : state.activeUUID
        let isActive = state.activeUUID === uuid ? true : false

        let savePath = payload.savePath ? payload.savePath : state.tabs[index].meta.savePath

        // Execute only when no savePath is chosen or forced reselection
        if( !savePath || payload.force )
        {
            savePath = await Dialog.saveDialog()

            commit('setBackgroundSavePath_', {index, savePath})
            if( isActive ) commit('setSavePath_', savePath)
        }

        try
        {
            // ToDo: not only the active document
            await fs.writeFile(savePath, JSON.stringify(state.document))

            commit('setBackgroundChanged_', {index, changed: false})

            if( isActive )
            {
                commit('setChanged_', false)
            }
        }
        catch(error)
        {
            console.error(error)
        }
    },

    async chooseSavePath({ commit, getters }) {
        let index = getters.activeIndex
        let savePath = await Dialog.saveDialog()

        commit('setBackgroundSavePath_', {index, savePath})
        commit('setSavePath_', savePath)
    },

    async chooseExportPath({ commit, getters }) {
        let index = getters.activeIndex
        let exportPath = await Dialog.exportDialog()

        console.log(exportPath)

        commit('setBackgroundExportPath_', {index, exportPath})
        commit('setExportPath_', exportPath)
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

    //////////
    // Tabs //
    //////////

    addTabs_: (state, param) => {
        state.tabs.push( ...param )
    },

    deleteTab_: (state, param) => {
        state.tabs.splice(param, 1)
    },

    documentToBackground_: (state, param) => {
        if( param.data.meta.isGhost === false )
        {
            state.tabs[param.index] = cloneDeep(param.data)
        }
    },

    setBackgroundSavePath_: (state, param) => {
        state.tabs[param.index].meta.savePath = param.savePath

        try
        {
            state.tabs[param.index].meta.name = path.basename(param.savePath, path.extname(param.savePath))
        }
        catch (error)
        {
            console.error(error)
        }
    },

    setBackgroundExportPath_: (state, param) => {
        state.tabs[param.index].meta.exportPath = param.exportPath
    },

    setBackgroundChanged_: (state, param) => {
        state.tabs[param.index].meta.changed = param.changed
    },



    //////////////
    // Document //
    //////////////

    documentToForeground_: (state, param) => {
        state.document = cloneDeep(param.data)
        if( typeof param.data.UUID === 'string' ) state.activeUUID = param.data.UUID
    },

    insertStructure_: (state, param) => {

        let layers = []
        let path = 'state.document.structures'
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
        let path = 'state.document.structures'
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

        recursiveUuidSearch(state.document.structures)
    },

    selectElements_: (state, param) => {
        if( param.clearPrevious )
        {
            state.document.ui.selectedStructures = []
        }

        state.document.ui.selectedStructures.push(...param.uuids)
    },

    deselectElements_: (state, param) => {

        if( param.deselectAll === true )
        {
            state.document.ui.selectedStructures = []
        }
        else
        {
            for (const uuid of param.uuids)
            {
                let i = state.document.ui.selectedStructures.indexOf(uuid)
    
                if( i >= 0 )
                {
                    state.document.ui.selectedStructures.splice(i, 1)
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

        recursiveDelete(state.document.structures)
    },

    setSavePath_: (state, param) => {
        state.document.meta.savePath = param

        // Try to extract name from savePath and set it in focused tab
        try
        {
            state.document.meta.name = path.basename(param, path.extname(param))
        }
        catch(error)
        {
            console.error(error)
        }
    },

    setExportPath_: (state, param) => {
        state.document.meta.exportPath = param
    },

    setChanged_: (state, param) => {
        state.document.meta.changed = param
    },

    addToHistory_: (state, param) => {
        let doc = cloneDeep(state.document.structures)
        console.log({action: param.action, state: doc })
    },
}

export default {
    state,
    getters,
    actions,
    mutations,
}