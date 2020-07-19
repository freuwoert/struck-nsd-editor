const { dialog } = require('electron').remote

export default {
    
    saveDialog() {

        return new Promise((resolve, reject)=>{

            let options = {
                title : "Diagramm speichern",
                buttonLabel : "Speichern",
                filters: [
                    { name: 'Struck Dokument', extensions: ['struck'] }
                ],
            }

            dialog.showSaveDialog(options).then((data)=>{
                if( !data.canceled ) resolve(data.filePath)
                else resolve(null)
            }).catch((error) => {
                resolve(null)
            })
        })
    },

    openDialog() {

        return new Promise((resolve, reject)=>{

            let options = {
                title : "Diagramm öffnen",
                buttonLabel : "Öffnen",
                filters: [
                    { name: 'Struck Dokument', extensions: ['struck'] }
                ],
                properties: ['openFile', 'multiSelections'],
            }
            dialog.showOpenDialog(options).then((data) => {
                if (!data.canceled) resolve(data.filePaths)
                else resolve(null)
            }).catch((error) => {
                resolve(null)
            })
        })
    },

    exportDialog() {

        return new Promise((resolve, reject) => {

            let options = {
                title : "Diagramm exportieren",
                buttonLabel : "Auswählen",
            }

            dialog.showSaveDialog(options).then((data) => {
                if (!data.canceled) resolve(data.filePath)
                else resolve(null)
            }).catch((error) => {
                resolve(null)
            })
        })
    },
}