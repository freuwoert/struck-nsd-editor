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
                    content: 'a = 650'
                },
                {
                    type: 'while',
                    content: 'i in range(100)',
                    children: []
                },
                {
                    type: 'endless-loop',
                    content: 'gameLoop',
                    children: [
                        {
                            type: 'call',
                            content: 'updateFrame()'
                        },
                        {
                            type: 'break',
                            content: 'break'
                        },
                    ]
                },
                {
                    type: 'do-while',
                    content: 'i in range(50)',
                    children: []
                },
            ]
        }

        // When class has been assigned an UUID
        if( this.UUID )
        {
            this.ui.view = 'LANDING'
            this.meta.name = 'New Tab'
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