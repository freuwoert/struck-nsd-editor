module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                appId: "com.freuwort.struck",
                productName: "Struck NSD Editor",
                npmArgs: "--production",
                publish: ['github'],
                win: {
                    "target": "nsis",
                    "icon": "build/icon.ico",
                    "publish": [
                        {
                            "provider": "github",
                            "owner": "freuwoert",
                            "repo": "Struck-NSD-Editor"
                        }
                    ]
                },
                nsis: {
                    "runAfterFinish": false,
                    "oneClick": false,
                    "perMachine": true,
                    "allowToChangeInstallationDirectory": true
                },
                fileAssociations: [
                    {
                        name: "Struck",
                        description: "Struck Dokument",
                        ext: [
                            "struck"
                        ]
                    }
                ],
            }
        }
    }
}