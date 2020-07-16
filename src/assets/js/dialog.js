const { dialog } = require('electron').remote

export default {
    
    saveDialog() {

        return new Promise((resolve, reject)=>{
            dialog.showSaveDialog({ filters: [{ name: 'Struck Dokument', extensions: ['struck'] }]}).then((data)=>{
                if( !data.canceled ) resolve(data.filePath)
                else resolve(null)
            }).catch((error) => {
                resolve(null)
            })
        })
    },

    openDialog() {

        return new Promise((resolve, reject)=>{
            dialog.showOpenDialog({ filters: [{ name: 'Struck Dokument', extensions: ['struck'] }]}).then((data)=>{
                if( !data.canceled ) resolve(data.filePaths)
                else resolve(null)
            }).catch((error) => {
                resolve(null)
            })
        })
    }
}