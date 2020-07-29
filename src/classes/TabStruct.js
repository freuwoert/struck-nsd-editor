export default class TabStruct {

    constructor(uuid = '') {
        this.UUID = uuid
        this.meta = {
            changed: false,
            name: null,
            savePath: null,
            exportPath: null,
        }
        this.ui = {
            view: null,
            selectedStructures: [],
            focusedStructure: '',
        }
        this.history = []
        this.historyPosition = null
        this.savePosition = null
        this.structures = {
            children: [
                {
                    uuid: '87e31692-1fa2-4dd7-aa2b-50a9b16abcfa',
                    type: 'endless-loop',
                    content: 'main()',
                    children: [],
                }
            ]
        }

        // When class has been assigned an UUID
        if( this.UUID )
        {
            this.ui.view = 'LANDING'
            this.meta.name = 'Unbenannt'
            this.meta.isGhost = false
        }
    }

    getStruct() {
        let obj = {}

        for (const prop of Object.keys(this))
        {
            obj[prop] = this[prop]
        }

        return obj
    }
}