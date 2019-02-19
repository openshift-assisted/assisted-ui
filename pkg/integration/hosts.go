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

package integration

import (
	"net"
)

type Host struct {
	Name   string `json:"name"`
	Ip     net.IP `json:"ip"`
	Status string `json:"status"`
	Cpu    int    `json:"cpu"`
	Memory int    `json:"memory"`
	Disk   int    `json:"disk"`
	Type   string `json:"type"`
}

func GetHosts() ([]Host, error) {
	hostList := []Host{
		Host{
			Name:   "host-01",
			Ip:     net.ParseIP("192.168.10.1"),
			Status: "Enroll",
			Cpu:    25,
			Memory: 128,
			Disk:   1024,
			Type:   "Master",
		},
		Host{
			Name:   "host-02",
			Ip:     net.ParseIP("192.168.10.2"),
			Status: "Manageable",
			Cpu:    25,
			Memory: 128,
			Disk:   1024,
			Type:   "Master",
		},
	}

	return hostList, nil
}
