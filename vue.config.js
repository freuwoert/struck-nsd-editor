module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                appId: "com.freuwort.struck",
                productName: "Struck NSD Editor",
                npmArgs: "--production",
                win: {
                    "target": "nsis",
                    "icon": "build/icon.ico",
                    "publish": [
                        {
                            "provider": "github",
                            "owner": "freuwoert",
                            "repo": "vudesigner"
                        }
                    ]
                },
                nsis: {
                    "runAfterFinish": false,
                    "oneClick": false,
                    "perMachine": true,
                    "allowToChangeInstallationDirectory": true
                }
            }
        }
    }
}