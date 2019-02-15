// Copyright 2019, Red Hat
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package server

import (
	"encoding/json"
	"github.com/gorilla/mux"
	_ "github.com/metalkube/facet/statik"
	"github.com/rakyll/statik/fs"
	"log"
	"net/http"
)

type Server struct {
	Port string
}

func jsonMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		next.ServeHTTP(w, r)
	})
}

func respondWithJson(w http.ResponseWriter, obj interface{}) {
	resp := ApiResponse{Data: obj}
	err := json.NewEncoder(w).Encode(resp)
	if err != nil {
		log.Fatal(err)
		respondWithJson(w, "FAIL")
	}
}

func (s *Server) Start() {
	router := mux.NewRouter()

	notificationChannel := make(chan Notification, 5)

	// API router; add new routes here
	api := router.PathPrefix("/api").Subrouter()
	api.Use(jsonMiddleware)
	api.HandleFunc("/hosts", HostsHandler)
	api.HandleFunc("/long", LongRunningTaskHandler(notificationChannel))

	websocketWorker := NewWebsocketWorker(notificationChannel)
	go websocketWorker.Run()

	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ServeWS(websocketWorker, w, r)
	})

	// Attempt to get the statik-built bundle
	statikFS, err := fs.New()

	if err != nil {
		// Statik data isn't present, serve files from './build'
		statikFS = http.Dir("./build/")
	}

	staticFileHandler := http.StripPrefix("/", http.FileServer(statikFS))
	router.PathPrefix("/").Handler(staticFileHandler).Methods("GET")

	log.Print("Server started at http://localhost:" + s.Port)
	err = http.ListenAndServe(":"+s.Port, router)

	if err != nil {
		log.Fatal("Failed to start server")
		log.Fatal(err)
	}

}
