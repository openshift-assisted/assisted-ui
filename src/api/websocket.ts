// TODO: This is just a dumb client to test the websocket connection
// TODO: This needs to be connected to the redux store

const startWebsocketService = (): void => {
  window.addEventListener('load', () => {
    let ws = new WebSocket('ws://localhost:8080/ws');

    ws.addEventListener('message', event => {
      try {
        let message = JSON.parse(event.data);
        // eslint-disable-next-line no-console
        console.log('Websocket message', message);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        return;
      }
    });
  });
};

export default startWebsocketService;
