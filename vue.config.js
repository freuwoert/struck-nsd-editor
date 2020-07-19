module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: "Struck Editor",
                npmArgs: "--production",
                publish: ["github"],
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