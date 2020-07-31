export default class TabStruct {

    constructor(uuid = '') {
        this.UUID = uuid
        this.meta = {
            name: null,
            savePath: null,
            exportPath: null,
        }
        this.ui = {
            selectedStructures: [],
        }
        this.savePosition = 0
        this.historyPosition = 0
        this.history = [{
            action: 'base-state',
            state: {
                children: [
                    {
                        uuid: '87e31692-1fa2-4dd7-aa2b-50a9b16abcfa',
                        type: 'endless-loop',
                        content: 'main()',
                        children: [],
                    }
                ]
            }
        }]
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