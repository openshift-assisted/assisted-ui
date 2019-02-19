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
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/metalkube/facet/pkg/common"
	"github.com/metalkube/facet/pkg/integration"
)

type ClusterDefinition struct {
	ClusterName string `json:"cluster_name"`
	DNSDomain   string `json:"dns_domain"`
	Username    string `json:"username"`
	Password    string `json:"password"`
	PullSecret  string `json:"pull_secret"`
}

func HostsHandler(w http.ResponseWriter, r *http.Request) {
	hostList, err := integration.GetHosts()
	// TODO: Implement a real JSON error handler
	if err != nil {
		log.Print(err)
	}
	RespondWithJson(w, hostList)
}

func CreateClusterDefinition(w http.ResponseWriter, r *http.Request) {
	var clusterDefinition ClusterDefinition
	err := json.NewDecoder(r.Body).Decode(&clusterDefinition)
	if err != nil {
		RespondWithError(w, err, 500)
		return
	}

	if clusterDefinition.PullSecret != "" {
		// TODO(jtomasek): update install-config.yaml with clusterDefinitionData (except username/password)
		RespondWithJson(w, clusterDefinition.PullSecret)
	} else {
		tokenData, err := integration.FetchAuthToken(clusterDefinition.Username, clusterDefinition.Password)
		if err != nil {
			RespondWithError(w, err, 500)
			return
		}

		pullSecret, err := integration.FetchPullSecret(tokenData)
		if err != nil {
			RespondWithError(w, err, 500)
			return
		}

		// TODO(jtomasek): update install-config.yaml with clusterDefinitionData (except username/password)
		// TODO(jtomasek): Response should be a complete InstallConfig object
		RespondWithJson(w, pullSecret)
	}
}

func IntrospectionDataHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
	introspection_data, err := integration.GetIntrospectionData(vars["host"])
	if err != nil {
		log.Print(err)
	}
	RespondWithJson(w, introspection_data)
}

// This is an example of a REST API endpoint handler which will trigger a long
// running task.  It takes a Notification channel as an argument, and returns a
// standard HTTP handler.  The idea is to create a closure over the notification
// channel.  When registering your handler with the router, you might do
// something like:
//
//   router.HandleFunc("/some-endpoint", LongRunningTaskHandler(notificationChannel))
//
//  See pkg/server/server.go for an example.
//
// In the body itself, you are expected to start the actual long-running task in
// a go routine, and quickly respond with a 2xx.
func LongRunningTaskHandler(notificationChannel chan common.Notification) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		response := "OK"
		go integration.PerformLongTask(notificationChannel)
		RespondWithJson(w, response)
	}
}

func BootstrapVMHandler(notificationChannel chan common.Notification) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "", http.StatusMethodNotAllowed)
			return
		}

		go integration.CreateBootstrapVM(notificationChannel)

		RespondWithJson(w, "Request accepted")

	}

}
