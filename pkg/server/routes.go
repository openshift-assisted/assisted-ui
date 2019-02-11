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
	"github.com/satori/go.uuid"
	"net"
	"net/http"
	"time"
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

type NotificationStatus int

const (
	SUCCESS NotificationStatus = 0
	RUNNING NotificationStatus = 1
	FAILURE NotificationStatus = 2
)

func (ns NotificationStatus) String() string {
	values := [...]string{
		"SUCCESS",
		"RUNNING",
		"FAILURE",
	}
	if ns < SUCCESS || ns > FAILURE {
		return "Unknown"
	}

	return values[ns]
}

func (ns NotificationStatus) MarshalJSON() ([]byte, error) {
	return json.Marshal(ns.String())
}

type Notification struct {
	Id        string             `json:"id"`
	Message   string             `json:"message"`
	Status    NotificationStatus `json:"status"`
	Timestamp time.Time          `json:"timestamp"`
}

func NewNotification(message string, status NotificationStatus) Notification {
	uuid, _ := uuid.NewV4()
	return Notification{
		Id:        uuid.String(),
		Message:   message,
		Status:    status,
		Timestamp: time.Now(),
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

// This is an example of a task that might take a while to finish.  It takes a
// Notification channel as an argument.  You can use this channel to send
// Notification messages to the browser.
func performLongTask(notificationChannel chan Notification) {
	n := NewNotification("Started a long running task", RUNNING)
	notificationChannel <- n

	// Do important work for 10 seconds
	time.Sleep(10 * time.Second)

	n2 := NewNotification("Finished a long running task", SUCCESS)
	notificationChannel <- n2
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
func LongRunningTaskHandler(notificationChannel chan Notification) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		response := "OK"
		go performLongTask(notificationChannel)
		respondWithJson(w, response)
	}
}
