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
	"fmt"
	"net/http"
)

type Host struct {
	Id string `json:"id"`
}

type ApiResponse struct {
	Data interface{} `json:"data"`
}

func respondWithJson(w http.ResponseWriter, obj interface{}) {
	resp := ApiResponse{Data: obj}
	err := json.NewEncoder(w).Encode(resp)
	if err != nil {
		fmt.Fprint(w, err)
	}
}

func HostsHandler(w http.ResponseWriter, r *http.Request) {
	hostList := [2]Host{
		Host{Id: "host-01"},
		Host{Id: "host-02"},
	}
	respondWithJson(w, hostList)
}
