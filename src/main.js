import fs from 'fs'
import Vue from 'vue'
import App from './App.vue'
import store from '@/store/store'
import Mousetrap from 'mousetrap'
import settings from 'electron-settings'
import { EventBus } from '@/assets/js/event-bus'
import { mapGetters, mapActions } from 'vuex'
import { ipcRenderer, remote } from 'electron'



Vue.config.productionTip = false

new Vue({
    el: '#app',
    store,
    computed: {
        ...mapGetters([
            'loadDelay',
            'appVersion',
            'selectedElements',
        ]),
    },
    methods: {
        ...mapActions([
            'undo',
            'redo',
            'addTab',
            'saveFile',
            'openFiles',
            'deleteElements',
            'setPreloaderUI',
            'setReleaseNoteUI',
        ])
    },
    
    // Mounted - in this case - functions as our main on-load event
    mounted() {

        // Starts up the app with one tab
        // ToDo: only if startup isn't done via a file
        this.addTab({selectOnCreation: true})



        /////////////////////////////////////////////////////////////
        // All events regarding menu options must be put down here //
        /////////////////////////////////////////////////////////////

        EventBus.$on('new', () => {
            this.addTab({selectOnCreation: true})
        })

        EventBus.$on('open', () => {
            this.openFiles({selectOnCreation: true})
        })

        EventBus.$on('save', () => {
            this.saveFile()
        })

        EventBus.$on('save-as', () => {
            this.saveFile({force: true})
        })

        EventBus.$on('delete', () => {
            this.deleteElements({elementUUIDs: [
                ...this.selectedElements
            ]})
        })

        EventBus.$on('undo', () => {
            this.undo({steps: 1})
        })

        EventBus.$on('redo', () => {
            this.redo({steps: 1})
        })



        //////////////////////////////
        // Events regarding ipcMain //
        //////////////////////////////
        
        // Tiggers loaded event
        ipcRenderer.send('loaded')

        // Gets paths of files that should be opened on startup
        ipcRenderer.on('open-on-startup', (e, args) => {

            // Checks if path is file and if path exists
            if( fs.lstatSync(args.path).isFile() && fs.existsSync(args.path) )
            {
                this.openFiles({openPaths: [args.path], selectOnCreation: true})
            }
        })

        // Checks Github for updates
        ipcRenderer.on('checking-for-update', function() {
            console.log('Suche nach Updates...')
        })

        // Notifies user of updates
        ipcRenderer.on('update-available', function(e, args) {
            console.log(`Update gefunden: Version ${args.version}`)
        })

        // Notifies user of non existing updates
        ipcRenderer.on('update-not-available', function() {
            console.log('Du bist auf dem neusten Stand!')
        })

        // Notifies user of finished download
        ipcRenderer.on('update-downloaded', function() {
            console.log('Update wurde heruntergeladen!')
        })

        // Notifies user of update errors
        ipcRenderer.on('update-error', function(e, args) {
            console.log(`Update Fehler: ${args.error}`)
        })



        /////////////////////////
        // Misc initialization //
        /////////////////////////

        // Initializes window controls
        initializeWindowControls()

        // Shows release notes after update
        if( settings.get('currentVersion') !== this.appVersion )
        {
            this.setReleaseNoteUI(true)
            settings.set('currentVersion', this.appVersion)
        }

        // Shows app
        setTimeout(() => { this.setPreloaderUI(false) }, this.loadDelay)
    },
    render: h => h(App)
})



/////////////////////
// Keyboard events //
/////////////////////

Mousetrap.bind(['ctrl+n','command+n'],             function(){ EventBus.$emit('new') })
Mousetrap.bind(['ctrl+o','command+o'],             function(){ EventBus.$emit('open') })
Mousetrap.bind(['ctrl+e','command+e'],             function(){ EventBus.$emit('export') })
Mousetrap.bind(['ctrl+s','command+s'],             function(){ EventBus.$emit('save') })
Mousetrap.bind(['ctrl+shift+s','command+shift+s'], function(){ EventBus.$emit('save-as') })
Mousetrap.bind(['ctrl+shift+e','command+shift+e'], function(){ EventBus.$emit('settings') })
Mousetrap.bind(['ctrl+shift+m','command+shift+m'], function(){ EventBus.$emit('menu') })
Mousetrap.bind(['del','backspace'],                function(){ EventBus.$emit('delete') })
Mousetrap.bind(['ctrl+z','command+z'],             function(){ EventBus.$emit('undo') })
Mousetrap.bind(['ctrl+y','ctrl+shift+z','command+shift+z'], function(){ EventBus.$emit('redo') })



function initializeWindowControls()
{
    // Sets shorthand vars
    const win = remote.getCurrentWindow()
    const body = document.body

    // Gets buttons
    const buttonMin = document.getElementById('min-button')
    const buttonMax = document.getElementById('max-button')
    const buttonRestore = document.getElementById('restore-button')
    const buttonClose = document.getElementById('close-button')



    // Toggles maximise / restore buttons when maximisation or unmaximisation occurs
    function toggleButtons()
    {
        body.classList.remove('maximized')

        if( win.isMaximized() )
        {
            body.classList.add('maximized')
        }
    }

    // Executes on load
    toggleButtons()

    // Makes minimise, maximise, restore and close buttons work when they are clicked
    // ToDo: remove event listeners
    buttonMin.addEventListener('click', () => {
        win.minimize()
    })

    buttonMax.addEventListener('click', () => {
        win.maximize()
    })

    buttonRestore.addEventListener('click', () => {
        win.unmaximize()
    })

    buttonClose.addEventListener('click', () => {
        win.close()
    })

    win.on('maximize', () => {
        toggleButtons()
    })

    win.on('unmaximize', () => {
        toggleButtons()
    })
}