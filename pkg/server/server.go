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
	"log"
	"net/http"

	"github.com/openshift-metalkube/facet/pkg/common"
	_ "github.com/openshift-metalkube/facet/statik"
)

type Server struct {
	Port string
}

type ApiResponse struct {
	Data interface{} `json:"data"`
}

type ApiErrorResponse struct {
	Error interface{} `json:"error"`
}

func jsonMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		next.ServeHTTP(w, r)
	})
}

func (s *Server) Start() {
	notificationChannel := common.NewNotificationChannel()
	websocketWorker := NewWebsocketWorker(notificationChannel)

	router := CreateRouter(notificationChannel, websocketWorker)

	go websocketWorker.Run()

	log.Print("Server started at http://0.0.0.0:" + s.Port)

	err := http.ListenAndServe("0.0.0.0:"+s.Port, router)

	if err != nil {
		log.Fatal("Failed to start server: ", err)
	}

}
