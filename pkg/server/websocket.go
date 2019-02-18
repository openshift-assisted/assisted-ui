package server

import (
	"github.com/gorilla/websocket"
	"github.com/metalkube/facet/pkg/common"
	"log"
	"net/http"
)

type Client struct {
	conn *websocket.Conn
}

func (c Client) send(notification common.Notification) {
	log.Print("Sending message to client: ", notification.Id)
	err := c.conn.WriteJSON(notification)
	if err != nil {
		log.Fatal("Failed to send message ", notification.Id)
		log.Fatal(err)
	}
}

// The WebSocket Worker will be a long-running go routine which registers
// websocket clients connections, and broadcasts notification to connected clients.
type WebsocketWorker struct {
	clients    []*Client                // Connected clients
	broadcasts chan common.Notification // A channel of messages to be sent to all clients
	register   chan *Client             // A channel of websocket clients trying to connect
}

func NewWebsocketWorker(broadcastChannel chan common.Notification) *WebsocketWorker {
	return &WebsocketWorker{
		clients:    make([]*Client, 0),
		register:   make(chan *Client, 0),
		broadcasts: broadcastChannel,
	}
}

// This function starts the WebsocketWorker.
func (ww *WebsocketWorker) Run() {
	log.Print("Websocket worker online")

	for {
		select {
		case client := <-ww.register:
			log.Print("Registering websocket client")
			ww.clients = append(ww.clients, client)
		case message := <-ww.broadcasts:
			for _, client := range ww.clients {
				client.send(message)

			}
		}
	}
}

// ServerWS is the HTTP handler which receives the initial websocket connection
// and registers the client with the worker.
func ServeWS(ww *WebsocketWorker, w http.ResponseWriter, r *http.Request) {
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			// Always return true because during development it's
			// much more convenient to run from two different ports
			return true
		},
	}

	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Fatal("Websocket pgrade failed:", err)
		return
	}

	client := &Client{conn: conn}
	ww.register <- client
}
