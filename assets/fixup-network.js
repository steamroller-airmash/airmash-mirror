!function() {
    window.DEBUG_PACKET_DUMP = 0;

    function mainFunction() {
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
                let match = /^wss:\/\/game-([A-Za-z0-9_\-.]+).airma.sh\/([A-Za-z0-9_\-?\/.=]+)$/g.exec(domain);

                if (!match) {
                    super(domain);
                }
                else {
                    if (window.location.hostname === "localhost") {
                        super("ws://localhost:3501");
                        return;
                    }

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
                if (obj.url.startsWith('/game')) {
                    let obj_success = obj.success;

                    obj.success = function(Pn) {
                        try {
                            en = JSON.parse(Pn.data);
                        }
                        catch (x) {
                            console.error("Ajax interceptor got invalid data. Error: ", x, "Data: ", Pn.data);
                        }

                        return obj_success(Pn);
                    };
                }

                $_ajax(obj);
            }

            Games_setup();

            $.ajax = $_ajax;
        }

        let Players_network = Players.network;
        Players.network = function(ty, packet) {
            if (window.DEBUG_PACKET_DUMP)
                console.log(packet);
            return Players_network(ty, packet);
        }
    };

    if (SWAM) {
        SWAM.on("gameLoaded", mainFunction);
    }
    else {
        mainFunction();
    }

    $.getScript("https://browser.sentry-cdn.com/4.4.2/bundle.min.js")
        .done(function() {
            Sentry.init({ dsn: 'https://611bc23c36834a0a884204f3dac6a087@sentry.io/1361915' });
        });
}();
