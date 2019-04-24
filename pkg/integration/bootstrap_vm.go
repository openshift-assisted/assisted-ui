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
	"fmt"
	"github.com/openshift-metal3/facet/pkg/common"
	"log"
	"os/exec"
)

const (
	// This command refers to the shell script in the dev-scripts repository.
	deployBoostrapVMCommand = "./05_deploy_bootstrap_vm.sh"
)

func CreateBootstrapVM(notificationChannel chan common.Notification) {
	log.Print("Booting bootstrap VM")

	n := common.NewNotification("Booting bootstrap VM", common.RUNNING)
	notificationChannel <- n

	cmd := exec.Command(deployBoostrapVMCommand)
	out, err := cmd.Output()

	if err != nil {
		m := fmt.Sprintf("Bootstrap VM failed to boot: %q", out)
		n := common.NewNotification(m, common.FAILURE)
		log.Print(m)
		notificationChannel <- n
		return
	}

	log.Print("Bootstrap VM booted")
	n = common.NewNotification("Bootstrap VM booted", common.SUCCESS)
	notificationChannel <- n
}
