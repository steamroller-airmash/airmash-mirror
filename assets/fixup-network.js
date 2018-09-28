
!function() {
    SWAM.on("gameLoaded", function() {
        let en = [];

        function findById(id) {
            if (id === "closest")
                return en[0];

            for (let i = 0; i < en.length; ++i) {
                if (en[i].id === id) 
                    return en[i];
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

        let Network_setup = Network.setup;
        Network.setup = function() {
            let OldWebSocket = window.WebSocket;
            window.WebSocket = class NewWebSocket extends OldWebSocket {
                constructor(domain) {
                    let match = /^wss:\/\/game-([A-Za-z0-9_-]+).airma.sh\/([A-Za-z0-9_-]+)$/g;

                    console.log(en);
                    if (!match) {
                        super(domain);
                    }
                    else {
                        let region = match[1];
                        let server = match[2];

                        console.log(region, server);
                        super(domain);
                    }
                }
            }

            Network_setup();

            window.WebSocket = OldWebSocket;
        }

    })
}();