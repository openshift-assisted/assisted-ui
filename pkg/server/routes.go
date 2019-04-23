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
	"net/http"

	"github.com/gorilla/mux"
	"github.com/openshift-metal3/facet/pkg/common"
	"github.com/rakyll/statik/fs"
)

func ApiRouter(router *mux.Router, notificationChannel chan common.Notification) {
	router.Use(jsonMiddleware)

	router.HandleFunc("/hosts", HostsHandler)
	router.HandleFunc("/long", LongRunningTaskHandler(notificationChannel))
	router.HandleFunc("/bootstrap-vm", BootstrapVMHandler(notificationChannel))
	router.HandleFunc("/cluster-definition", CreateClusterDefinition).Methods("POST")
}

func CreateRouter(notificationChannel chan common.Notification, websocketWorker *WebsocketWorker) *mux.Router {
	router := mux.NewRouter()

	api := router.PathPrefix("/api").Subrouter()
	ApiRouter(api, notificationChannel)

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

	return router
}
