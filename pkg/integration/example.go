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
	"github.com/openshift-metal3/facet/pkg/common"
	"time"
)

// This is an example of a task that might take a while to finish.  It takes a
// Notification channel as an argument.  You can use this channel to send
// Notification messages to the browser.
func PerformLongTask(notificationChannel chan common.Notification) {
	n := common.NewNotification("Started a long running task", common.RUNNING)
	notificationChannel <- n

	// Do important work for 10 seconds
	time.Sleep(10 * time.Second)

	n2 := common.NewNotification("Finished a long running task", common.SUCCESS)
	notificationChannel <- n2
}
