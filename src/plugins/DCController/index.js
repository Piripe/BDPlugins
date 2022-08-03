const { config } = require("process");

module.exports = (Plugin, Api) => {
    const http = require("http");

    return class DCController extends Plugin {
        onStart() {
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
        createServer() {
            const server = http.createServer((req, res) => {
                let path = req.url.split("/");
                if (path[1] === "mute") {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Muting");
                    BdApi.findModuleByProps("toggleSelfMute").toggleSelfMute();
                } else if (path[1] === "deafen") {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Deafening");
                    BdApi.findModuleByProps("toggleSelfMute").toggleSelfDeaf();
                } else if (path[1] === "stream") {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Starting stream");

                    let buttons = document.getElementsByClassName("button-1EGGcP");
                    if (buttons.length >= 2) {
                        buttons[1].click();
                    }
                } else if (path[1] === "stop_stream") {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Stopping stream");
                    BdApi.findModuleByProps("startStream").stopOwnStream();
                } else if (path[1] === "video") {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Starting/stopping video");
                    let buttons = document.getElementsByClassName("button-1EGGcP");
                    if (buttons.length >= 1) {
                        buttons[0].click();
                    }
                } else if (path[1] === "start_video") {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Starting video");
                    BdApi.findModuleByProps("setVideoEnabled").setVideoEnabled(true);
                } else if (path[1] === "stop_video") {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Stopping video");
                    BdApi.findModuleByProps("setVideoEnabled").setVideoEnabled(false);
                } else if (path[1] === "disconnect") {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Disconnecting");
                    BdApi.findModuleByProps("selectVoiceChannel").disconnect();
                } else if (path[1] === "settings") {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Opening settings");
                    ZLibrary.DiscordModules.UserSettingsWindow.open(
                        ZLibrary.DiscordModules.DiscordConstants.UserSettingsSections.ACCOUNT
                    );
                } else if (path[1] === "docs") {
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
                            </style>
                        </head>
                        <body>
                            <div class="nav">
                                <div class="logo">
                                    <div class="name">${config.info.name}</div>
                                    <div class="version">v${config.info.version}</div>
                                </div>
                            </div>
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
                } else if (path[1] === "version") {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Version " + config.info.version);
                }
            });
            server.on("error", err => {});
            server.listen(6969, () => {});
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
                    <div class="try">
                        <h3>Try it</h3>
                        <input
                            class="try-req"
                            readonly="true"
                            type="text"
                            value="curl ${host}${request.request}"
                        />
                        <button class="send-req" onclick="getRequest(event)" aria-label="${
                            request.request
                        }">
                            Send
                        </button>
                        <input
                            class="try-result"
                            style="display: none"
                            readonly="true"
                            type="text"
                        />
                    </div>
                </div>
                `;
            });
            return result;
        }
    };
};
