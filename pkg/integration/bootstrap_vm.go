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
	"github.com/metalkube/facet/pkg/common"
	"log"
	"os/exec"

	"github.com/openshift/installer/pkg/asset"
	assetstore "github.com/openshift/installer/pkg/asset/store"
	targetassets "github.com/openshift/installer/pkg/asset/targets"
	"github.com/pkg/errors"
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

// CreateIgnitionConfigs tries to replicate the runTargetCmd function from
// openshift/installer and uses the IgnitionConfigs assets
// https://github.com/openshift/installer/blob/1886b7d7fef12d6a4ab21b289824a14b56643d28/cmd/openshift-install/create.go#L149
//
// Given a directory which contains an install-config.yaml file, this runs the
// equivalent of:
//
//   $ openshift-install --dir directory create ignition-configs
func CreateIgnitionConfigs(directory string) error {

	targets := targetassets.IgnitionConfigs

	assetStore, err := assetstore.NewStore(directory)
	if err != nil {
		return errors.Wrapf(err, "failed to create asset store")
	}

	for _, a := range targets {
		err := assetStore.Fetch(a)
		if err != nil {
			err = errors.Wrapf(err, "failed to fetch %s", a.Name())
		}

		if err2 := asset.PersistToFile(a, directory); err2 != nil {
			err2 = errors.Wrapf(err2, "failed to write asset (%s) to disk", a.Name())
			if err != nil {
				return err
			}
			return err2
		}

		if err != nil {
			return err
		}
	}
	return nil
}
