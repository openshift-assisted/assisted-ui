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
	"log"
	"net/http"
)

func UnknownError(w http.ResponseWriter, err error) {
	http.Error(w, err.Error(), 500)
}

func RespondWithJson(w http.ResponseWriter, obj interface{}) {
	resp := ApiResponse{Data: obj}
	err := json.NewEncoder(w).Encode(resp)
	if err != nil {
		log.Fatal(err)
		UnknownError(w, err)
	}
}

func RespondWithK8s(w http.ResponseWriter, obj interface{}) {
	err := json.NewEncoder(w).Encode(obj)
	if err != nil {
		log.Fatal(err)
		UnknownError(w, err)
	}

}

func RespondWithError(w http.ResponseWriter, err error, code ...int) {
	if len(code) > 0 {
		w.WriteHeader(code[0])
	}

	resp := ApiErrorResponse{Error: err.Error()}
	err = json.NewEncoder(w).Encode(resp)

	if err != nil {
		UnknownError(w, err)
	}

}
