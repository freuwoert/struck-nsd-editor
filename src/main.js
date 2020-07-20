import Vue from 'vue'
import App from './App.vue'
import store from '@/store/store'
import { EventBus } from '@/assets/js/event-bus'
import { ipcRenderer } from 'electron'

import { mapGetters, mapActions } from 'vuex'

const remote = require('electron').remote
const settings = require('electron-settings')
const Mousetrap = require('mousetrap')



Vue.config.productionTip = false

const app = new Vue({
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
            'addTab',
            'saveFile',
            'openFiles',
            'deleteElements',
            'setPreloaderUI',
            'setReleaseNoteUI',
        ])
    },
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

        //////////////////////////////
        // Events regarding ipcMain //
        //////////////////////////////
        
        // Tiggers loaded event
        ipcRenderer.send('loaded')

        // Gets paths of files that should be opened on startup
        ipcRenderer.on('open-on-startup', function(e, args) {
            console.log(args.paths)
        })

        // Checks Github for updates
        ipcRenderer.on('checking-for-updates', function() {
            console.log('Suche nach Updates...')
        })

        // Notifies user of updates
        ipcRenderer.on('updates-available', function(e, args) {
            console.log(`Update gefunden: Version ${args.version}`)
        })

        // Notifies user of non existing updates
        ipcRenderer.on('no-updates-available', function() {
            console.log('Du bist auf dem neusten Stand!')
        })

        // Notifies user of finished download
        ipcRenderer.on('updates-downloaded', function() {
            console.log('Update wurde heruntergeladen!')
        })

        // Notifies user of update errors
        ipcRenderer.on('update-errors', function(e, args) {
            console.log(`Update Fehler: ${args.error}`)
        })
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



// When document has loaded, initialise
document.onreadystatechange = () => {
    if (document.readyState === 'complete')
    {
        handleWindowControls()

        // Shows release notes after update
        if (settings.get('currentVersion') !== app.appVersion)
        {
            app.setReleaseNoteUI(true)
            settings.set('currentVersion', app.appVersion)
        }

        setTimeout(() => {
            app.setPreloaderUI(false)
        }, app.loadDelay)
    }
}

function handleWindowControls ()
{
    // Makes minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener('click', event => {
        remote.getCurrentWindow().minimize()
    })

    document.getElementById('max-button').addEventListener('click', event => {
        remote.getCurrentWindow().maximize()
    })

    document.getElementById('restore-button').addEventListener('click', event => {
        remote.getCurrentWindow().unmaximize()
    })

    document.getElementById('close-button').addEventListener('click', event => {
        remote.getCurrentWindow().close()
    })

    // Toggles maximise/restore buttons when maximisation/unmaximisation occurs
    if (remote.getCurrentWindow().isMaximized())
    {
        document.body.classList.add('maximized')
    }
    else
    {
        document.body.classList.remove('maximized')
    }

    remote.getCurrentWindow().on('maximize', function () {
        if (remote.getCurrentWindow().isMaximized())
        {
            document.body.classList.add('maximized')
        }
        else
        {
            document.body.classList.remove('maximized')
        }
    })

    remote.getCurrentWindow().on('unmaximize', function () {
        if (remote.getCurrentWindow().isMaximized())
        {
            document.body.classList.add('maximized')
        }
        else
        {
            document.body.classList.remove('maximized')
        }
    })
}