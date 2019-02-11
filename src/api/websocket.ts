// TODO: This needs to be connected to the redux store

const startWebsocketService = () => {

    window.addEventListener('load', () => {
        let ws = new WebSocket('ws://localhost:8080/ws');

        ws.addEventListener('message', event => {
            try {
                let message = JSON.parse(event.data);
                console.log('Websocket message', message)
            } catch(e) {
                console.log(e)
                return
            }

        });
    });

};

export default startWebsocketService;
