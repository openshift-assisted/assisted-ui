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

package host

import (
	"encoding/json"
	"fmt"
	"github.com/metalkube/facet/pkg/integration"
	"github.com/spf13/cobra"
	"log"
)

var args struct {
	port string
}

var Cmd = &cobra.Command{
	Use:   "host",
	Short: "Interact with baremetal hosts",
	Long:  "",
	Run:   nil,
}

func init() {

	Cmd.AddCommand(
		&cobra.Command{
			Use:   "list",
			Short: "List baremetal hosts",
			Long:  "List baremetal hosts",
			Run:   listHosts,
		},
	)

}

func listHosts(cmd *cobra.Command, argv []string) {
	hosts, err := integration.GetHosts()

	if err != nil {
		log.Fatal(err)
	}

	data, err := json.MarshalIndent(hosts, "", "  ")

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(string(data))
}
