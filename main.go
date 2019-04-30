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

package main

import (
	"fmt"
	"os"

	"github.com/openshift-metal3/facet/cmd/host"
	"github.com/openshift-metal3/facet/cmd/server"
	"github.com/spf13/cobra"
)

var root = &cobra.Command{
	Use:  "facet",
	Long: "Facet\n\nMetal³ Facet is an interface to kubernetes baremetal provisioning.",
}

func init() {
	root.AddCommand(server.Cmd)
	root.AddCommand(host.Cmd)
}

func main() {
	err := root.Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to execute command: %v\n", err)
		os.Exit(1)
	}

}
