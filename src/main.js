import Vue from 'vue'
import App from './App.vue'
import store from '@/store/store'
import { EventBus } from '@/assets/js/event-bus'
import { ipcRenderer } from 'electron'

import { mapGetters, mapActions } from 'vuex'

// GLOBAL REQUIREMENTS
const settings = require('electron-settings')
const Mousetrap = require('mousetrap')
const remote = require('electron').remote






Vue.config.productionTip = false

const app = new Vue({
    el: '#app',
    store,
    computed: {
        ...mapGetters([
            'vAppInfo',
            'GENERAL_UI',
            'selectedElements',
        ]),
    },
    methods: {
        ...mapActions([
            'saveFile',
            'openFiles',
            'addTab',
            'deleteElements',
        ])
    },
    mounted() {
        this.addTab({selectOnCreation: true})

        // All events regarding menu options must be put down here

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

        ipcRenderer.on('mainCommand', function(event, args) {
    
            const commandsFromMain = {
                startupOpen:    (args) => { console.log(args[1]) },
        
                update_checking:        (args) => { console.log('Searching for updates...') },
                update_available:       (args) => { console.log('Update found: <b>Version '+ JSON.parse(args[1]).version +'</b>') },
                update_not_available:   (args) => { console.log('You are up to date!') },
                update_downloaded:      (args) => { console.log('<b>Update wurde heruntergeladen!</b><br>Sie können das Programm jederzeit neustarten, um das Update zu installieren.') },
                update_error:           (args) => { console.log('Update Fehler:<br>') },
            }
        
            if( commandsFromMain.hasOwnProperty(args[0]) )
            {
                commandsFromMain[args[0]](args)
            }
        })
    },
    render: h => h(App)
})

/////////////////////
// keyboard events //
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

        // Show release notes after update
        if (settings.get('currentVersion') !== app.vAppInfo)
        {
            app.GENERAL_UI.releaseNote = true
            settings.set('currentVersion', app.vAppInfo)
        }

        setTimeout(() => {
            document.getElementById('preloader').classList.add('loaded')
        }, app.GENERAL_UI.loadDelay)
    }
}

function handleWindowControls ()
{
    // Make minimise/maximise/restore/close buttons work when they are clicked
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

    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
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