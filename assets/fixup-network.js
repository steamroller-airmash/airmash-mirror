!function() {
    SWAM.on("gameLoaded", function() {
        let en = [];

        function findById(en, id) {
            if (id === "closest")
                return en[0];

            for (let i = 0; i < en.length; ++i) {
                if (en[i].id === id) 
                    return en[i];
            }

            return null;
        }

        window.WebSocket = class NewWebSocket extends WebSocket {
            constructor(domain) {
                let match = /^wss:\/\/game-([A-Za-z0-9_-]+).airma.sh\/([A-Za-z0-9_-]+)$/g.exec(domain);

                if (!match) {
                    super(domain);
                }
                else {
                    try {
                        let region = findById(en, game.playRegion);
                        let server = findById(region.games, game.playRoom);

                        super(server.url);
                    }
                    catch(e) {
                        console.error(e);
                        super(domain);
                    }
                }
            }
        }

        let Games_setup = Games.setup;
        Games.setup = function() {
            let $_ajax = $.ajax;
            $.ajax = function(obj) {
                let obj_success = obj.success;

                obj.success = function(Pn) {
                    try {
                        en = JSON.parse(Pn.data);
                    }
                    catch (x) {
                        return
                    }

                    return obj_success(Pn);
                };

                $_ajax(obj);
            }

            Games_setup();

            $.ajax = $_ajax;
        }
    })
}();
