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
	"fmt"
	"github.com/gorilla/mux"
	_ "github.com/metalkube/facet/statik"
	"github.com/rakyll/statik/fs"
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

func (s *Server) Start() {
	router := mux.NewRouter()

	// API router; add new routes here
	api := router.PathPrefix("/api").Subrouter()
	api.Use(jsonMiddleware)
	api.HandleFunc("/hosts", HostsHandler)

	// Attempt to get the statik-built bundle
	statikFS, err := fs.New()

	if err != nil {
		// Statik data isn't present, serve files from './build'
		statikFS = http.Dir("./build/")
	}

	staticFileHandler := http.StripPrefix("/", http.FileServer(statikFS))
	router.PathPrefix("/").Handler(staticFileHandler).Methods("GET")

	fmt.Println("Server started at http://localhost:" + s.Port)
	http.ListenAndServe(":"+s.Port, router)

}
