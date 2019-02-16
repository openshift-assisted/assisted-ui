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

package common

import (
	"encoding/json"
	"github.com/satori/go.uuid"
	"time"
)

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
	uuid := uuid.NewV4()
	return Notification{
		Id:        uuid.String(),
		Message:   message,
		Status:    status,
		Timestamp: time.Now(),
	}
}
