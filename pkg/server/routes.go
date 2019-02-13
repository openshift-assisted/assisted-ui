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
	"net"
	"net/http"
)

type Host struct {
	Name   string `json:"name"`
	Ip     net.IP `json:"ip"`
	Cpu    int    `json:"cpu"`
	Memory int    `json:"memory"`
	Disk   int    `json:"disk"`
	Type   string `json:"type"`
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
		Host{
			Name:   "host-01",
			Ip:     net.ParseIP("192.168.10.1"),
			Cpu:    25,
			Memory: 128,
			Disk:   1024,
			Type:   "Master",
		},
		Host{
			Name:   "host-02",
			Ip:     net.ParseIP("192.168.10.2"),
			Cpu:    25,
			Memory: 128,
			Disk:   1024,
			Type:   "Master",
		},
	}
	respondWithJson(w, hostList)
}
