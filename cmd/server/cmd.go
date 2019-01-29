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
	"fmt"
	"github.com/gorilla/mux"
	"github.com/spf13/cobra"
	"net/http"
)

var args struct {
	port string
}

// Cmd is the cobra serve command
var Cmd = &cobra.Command{
	Use:   "server",
	Short: "Run the facet server",
	Long:  "Run the facet server.",
	Run:   run,
}

func init() {
	flags := Cmd.Flags()
	flags.StringVar(
		&args.port,
		"port",
		"8080",
		"The port of the facet server",
	)
}

func run(cmd *cobra.Command, argv []string) {
	r := mux.NewRouter()

	// Serving the build/ directory from the / root of the app
	staticFileDirectory := http.Dir("./build/")
	staticFileHandler := http.StripPrefix("/", http.FileServer(staticFileDirectory))
	r.PathPrefix("/").Handler(staticFileHandler).Methods("GET")

	fmt.Println("Server started at http://localhost:" + args.port)
	http.ListenAndServe(":"+args.port, r)
}
