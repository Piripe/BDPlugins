const { config } = require("process");

module.exports = (Plugin, Api) => {
    const http = require("http");

    return class DCController extends Plugin {
        onStart() {
            config.settings = ZLibrary.PluginUtilities.loadData(
                "DCController",
                "settings",
                config.settings
            );
            this.createServer();
        }
        onStop() {
            ZLibrary.Modals.showConfirmationModal(
                "Restart required",
                "You need to restart Discord to close/restart DCController.",
                {
                    danger: true,
                    confirmText: "Restart",
                    cancelText: "I'll restart later",
                    onConfirm: () => {
                        location.reload();
                    },
                }
            );
        }
        getSettingsPanel() {
            let new_server_settings = { ...config.settings.server };
            let settings_panel = ZLibrary.Settings.SettingPanel.build(
                () => {
                    ZLibrary.PluginUtilities.saveData("DCController", "settings", config.settings);
                },

                new ZLibrary.Settings.SettingGroup("Web server").append(
                    new ZLibrary.Settings.Dropdown(
                        "Server listen address",
                        "Defines from which address a client can connect. (default : 127.0.0.1)",
                        config.settings.server.address,
                        [
                            { label: "Local address (127.0.0.1)", value: "127.0.0.1" },
                            { label: "Any address (0.0.0.0)", value: "0.0.0.0" },
                        ],
                        x => {
                            new_server_settings.address = x;
                        }
                    ),
                    new ZLibrary.Settings.Textbox(
                        "Server port",
                        "Defines the port of the server. (default : 6969)",
                        config.settings.server.port,
                        x => {
                            new_server_settings.port = Math.min(
                                65535,
                                Math.max(0, x.replace(/\D/g, ""))
                            );
                        }
                    )
                ),
                new ZLibrary.Settings.SettingGroup("Security").append(
                    new ZLibrary.Settings.Textbox(
                        "Authorization token.",
                        "(Optional) Set the `authorization` header for requests.",
                        config.settings.security.authorization,
                        x => {
                            config.settings.security.authorization = x;
                        }
                    )
                ),
                new ZLibrary.Settings.SettingGroup("Features").append(
                    ...config.features_list.map(
                        x =>
                            new ZLibrary.Settings.Switch(x, "", config.settings.features[x], y => {
                                config.settings.features[x] = y;
                            })
                    )
                )
            );
            settings_panel.appendChild(document.createElement("div"));
            BdApi.ReactDOM.render(
                BdApi.React.createElement(
                    "h5",
                    {
                        class: "colorStandard-1Xxp1s size14-k_3Hy4 title-3hptVQ defaultMarginh5-3Jxf6f",
                        style: { marginTop: "16px" },
                    },
                    [
                        "API Documentation : ",
                        BdApi.React.createElement(
                            "a",
                            {
                                href: "http://127.0.0.1:" + config.settings.server.port + "/docs",
                                target: "_blank",
                            },
                            "http://127.0.0.1:" + config.settings.server.port + "/docs"
                        ),
                    ]
                ),
                settings_panel.lastChild
            );
            ZLibrary.DOMTools.onRemoved(settings_panel, () => {
                if (
                    (new_server_settings.address != config.settings.server.address) |
                    (new_server_settings.port != config.settings.server.port)
                ) {
                    config.settings.server = new_server_settings;
                    ZLibrary.PluginUtilities.saveData("DCController", "settings", config.settings);
                    ZLibrary.Modals.showConfirmationModal(
                        "Restart required",
                        "You need to restart Discord to modify server configuration.",
                        {
                            danger: true,
                            confirmText: "Restart",
                            cancelText: "I'll restart later",
                            onConfirm: () => {
                                location.reload();
                            },
                        }
                    );
                }
            });
            return settings_panel;
        }
        createServer() {
            const server = http.createServer((req, res) => {
                let path = req.url.split("/");
                if (path[1] === "docs") {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    req.headers.host;
                    res.end(`
                    
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <meta charset="UTF-8" />
                            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <title>DCController Documentation</title>
                            <style>
                                @import url("https://fonts.googleapis.com/css2?family=Mulish:wght@200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&display=swap");

                                :root {
                                    --accent: #1aa1db;
                                    --accent-hover: #2aace4;
                                    --accent-background: #0d8abf;
                                    --background: #202123;
                                }
                                body {
                                    margin: 0;
                                    padding: 0;
                                    background-color: var(--background);
                                    color: #fff;
                                    font-family: "Roboto", "Mulish", sans-serif;
                                }
                                a {
                                    color: #fff;
                                    text-decoration: none;
                                    transition: color 0.3s;
                                }
                                a:hover {
                                    color: #ccc;
                                }
                                .nav,
                                .footer {
                                    background-color: var(--accent-background);
                                    height: 64px;
                                    box-shadow: 0px 0px 16px #000000aa;
                                    display: flex;
                                    align-items: center;
                                }
                                .footer {
                                    height: 128px;
                                    justify-content: space-around;
                                }
                                .links a:hover {
                                    color: #eee;
                                    text-decoration: underline;
                                }
                                .logo {
                                    display: flex;
                                    align-items: flex-end;
                                    margin-left: 5%;
                                    user-select: none;
                                }
                                .logo .name {
                                    font-size: 28px;
                                }
                                .logo .version {
                                    font-size: 14px;
                                }
                                .content {
                                    display: block;
                                    width: 50%;
                                    margin: 30px auto;
                                }
                                .category {
                                    border-bottom: 1px solid #ddd;
                                    padding: 12px 0;
                                }
                                .category > p,
                                .req > p,
                                .try,
                                .try > input {
                                    margin: 0 16px;
                                }
                                .req {
                                    margin: 16px 0;
                                    padding: 20px 16px;
                                    background-color: #00000028;
                                    border-radius: 8px;
                                }
                                .req>h2 {
                                    margin-top:0;
                                }
                                .try {
                                    display: flex;
                                    flex-direction: column;
                                }
                                .try-req {
                                    height: 32px;
                                    background-color: #fff1;
                                    border: none;
                                    color: #fff;
                                    border-radius: 4px;
                                    padding: 0 8px;
                                }
                                .send-req {
                                    width: 100px;
                                    height: 32px;
                                    background-color: var(--accent);
                                    border: none;
                                    color: #fff;
                                    border-radius: 4px;
                                    margin: 8px 16px;
                                }
                                .send-req:hover {
                                    background-color: var(--accent-hover);
                                }
                                .send-req:active {
                                    filter: brightness(1.05);
                                }
                                .try-result {
                                    height: 32px;
                                    background-color: #fff1;
                                    border: none;
                                    color: #fff;
                                    border-radius: 4px;
                                    padding: 0 8px;
                                }
                                .notice {
                                    background-color: #E224;
                                    border-bottom: 2px solid #F118;
                                    padding: 8px 0;
                                    display: flex;
                                    justify-content: center;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="nav">
                                <div class="logo">
                                    <div class="name">${config.info.name}</div>
                                    <div class="version">v${config.info.version}</div>
                                </div>
                            </div>
                            ${
                                config.settings.security.authorization == ""
                                    ? ""
                                    : `<div class="notice">For security reasons, the "Try" buttons are disabled. Clear the authorization token if you want to reactivate it.</div>`
                            }
                            <div class="content">
                                ${this.generateDocsContent(req.headers.host)}
                            </div>
                            <div class="footer">
                                <div class="logo">
                                    <div class="name">${config.info.name}</div>
                                    <div class="version">v${config.info.version}</div>
                                </div>
                                <div class="links">
                                    <p>Links</p>
                                    <a href="${config.info.github}">Github</a>
                                </div>
                            </div>
                            <script>
                                function getRequest(e) {
                                    fetch("http://${
                                        req.headers.host
                                    }" + e.target.attributes["aria-label"].value).then(x => {
                                        if ((x.status = 200)) {
                                            x.text().then(y => {
                                                let element = e.target.parentNode.querySelector(".try-result");
                                                element.value = y;
                                                element.style.display = "block";
                                            });
                                        }
                                    });
                                }
                            </script>
                        </body>
                    </html>

                    `);
                } else if (
                    (req.headers.authorization === config.settings.security.authorization) |
                    (config.settings.security.authorization == "")
                ) {
                    if ((path[1] === "mute") & config.settings.features["/mute"]) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("Muting");
                        BdApi.findModuleByProps("toggleSelfMute").toggleSelfMute();
                    } else if ((path[1] === "deafen") & config.settings.features["/deafen"]) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("Deafening");
                        BdApi.findModuleByProps("toggleSelfMute").toggleSelfDeaf();
                    } else if ((path[1] === "stream") & config.settings.features["/stream"]) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("Starting stream");

                        let buttons = document.getElementsByClassName("button-1EGGcP");
                        if (buttons.length >= 2) {
                            buttons[1].click();
                        }
                    } else if (
                        (path[1] === "stop_stream") &
                        config.settings.features["/stop_stream"]
                    ) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("Stopping stream");
                        BdApi.findModuleByProps("startStream").stopOwnStream();
                    } else if ((path[1] === "video") & config.settings.features["/video"]) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("Starting/stopping video");
                        let buttons = document.getElementsByClassName("button-1EGGcP");
                        if (buttons.length >= 1) {
                            buttons[0].click();
                        }
                    } else if (
                        (path[1] === "start_video") &
                        config.settings.features["/start_video"]
                    ) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("Starting video");
                        BdApi.findModuleByProps("setVideoEnabled").setVideoEnabled(true);
                    } else if (
                        (path[1] === "stop_video") &
                        config.settings.features["/stop_video"]
                    ) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("Stopping video");
                        BdApi.findModuleByProps("setVideoEnabled").setVideoEnabled(false);
                    } else if (
                        (path[1] === "disconnect") &
                        config.settings.features["/disconnect"]
                    ) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("Disconnecting");
                        BdApi.findModuleByProps("selectVoiceChannel").disconnect();
                    } else if ((path[1] === "settings") & config.settings.features["/settings"]) {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("Opening settings");
                        ZLibrary.DiscordModules.UserSettingsWindow.open(
                            ZLibrary.DiscordModules.DiscordConstants.UserSettingsSections.ACCOUNT
                        );
                    } else if (path[1] === "version") {
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end("Version " + config.info.version);
                    } else {
                        res.writeHead(404, { "Content-Type": "text/plain" });
                        res.end("Not Found.");
                    }
                } else {
                    res.writeHead(401, { "Content-Type": "text/plain" });
                    res.end("Unauthorized.");
                }
            });
            server.on("error", err => {});
            server.listen(config.settings.server.port, config.settings.server.address, () => {});
        }

        generateDocsContent(host) {
            let result = "";

            config.documentation.forEach(category => {
                result += `
                <div class="category">
                    <h1 id="${category.id}"><a href="#${category.id}">${category.name}</a></h1>
                    <p>${category.description}</p>
                    ${this.generateDocsCategory(host, category)}
                </div>
                `;
            });
            return result;
        }
        generateDocsCategory(host, category) {
            let result = "";
            category.requests.forEach(request => {
                result += `
                <div class="req">
                    <h2 id="${category.id + request.id}"><a href="#${category.id + request.id}">${
                    request.method
                } ${request.request}</a></h2>
                    <p>${request.description}</p>
                    ${
                        config.settings.security.authorization == ""
                            ? `<div class="try">
                        <h3>Try it</h3>
                        <input
                            class="try-req"
                            readonly="true"
                            type="text"
                            value="curl ${host}${request.request}"
                        />
                        <button class="send-req" onclick="getRequest(event)" aria-label="${request.request}">
                            Send
                        </button>
                        <input
                            class="try-result"
                            style="display: none"
                            readonly="true"
                            type="text"
                        />
                    </div>`
                            : `<div class="try">
                    <h3>Exemple</h3>
                    <input
                        class="try-req"
                        readonly="true"
                        type="text"
                        value="curl ${host}${request.request}"
                    />
                </div>`
                    }
                </div>
                `;
            });
            return result;
        }
    };
};
