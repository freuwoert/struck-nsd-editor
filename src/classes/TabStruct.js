export default class TabStruct {

    constructor(uuid = '') {
        this.UUID = uuid
        this.meta = {
            changed: false,
            name: null,
            savePath: null,
        }
        this.ui = {
            view: null,
            selectedStructures: [],
            focusedStructure: '',
        }
        this.structures = {
            children: [
                {
                    type: 'command',
                    content: 'command'
                },
            ]
        }

        // When class has been assigned an UUID
        if( this.UUID )
        {
            this.ui.view = 'LANDING'
            this.meta.name = 'Untitled NSD'
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