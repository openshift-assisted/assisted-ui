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
	"time"

	apis "github.com/metal3-io/baremetal-operator/pkg/apis/metal3/v1alpha1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
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

func GetHosts() (apis.BareMetalHostList, error) {
	creationTime := metav1.Date(2019, time.January, 22, 9, 30, 0, 0, time.UTC)
	t := metav1.Now()

	item := apis.BareMetalHost{
		ObjectMeta: metav1.ObjectMeta{
			Name:              "baremetalhost",
			Namespace:         "default",
			UID:               "some-uuid",
			CreationTimestamp: creationTime,
			Labels:            map[string]string{"app": "hello-world"},
		},
		Status: apis.BareMetalHostStatus{
			LastUpdated: &t,
			Provisioning: apis.ProvisionStatus{
				ID: "some ironic ID",
				Image: apis.Image{
					URL: "image.qcow",
				},
			},

			HardwareDetails: &apis.HardwareDetails{
				RAMGiB: 128,
				NIC: []apis.NIC{
					apis.NIC{
						MAC:       "00:A0:C9:14:C8:29",
						IP:        "192.168.100.100",
						SpeedGbps: 40,
					},
				},
				Storage: []apis.Storage{
					apis.Storage{
						SizeGiB: 1024,
						Model:   "disk info",
					},
				},
				CPUs: []apis.CPU{
					apis.CPU{
						Type:     "intel",
						SpeedGHz: 3,
					},
				},
			},
		},
		Spec: apis.BareMetalHostSpec{
			BMC: apis.BMCDetails{
				Address:         "192.168.100.100",
				CredentialsName: "bmc-creds-valid",
			},
			Online: true,
		},
	}

	list := apis.BareMetalHostList{
		TypeMeta: metav1.TypeMeta{
			Kind:       "BareMetalHostList",
			APIVersion: "alpha1",
		},
		Items: []apis.BareMetalHost{item},
		ListMeta: metav1.ListMeta{
			SelfLink:        "/api/v1/namespace/default/baremetalhosts",
			ResourceVersion: "123456",
		},
	}

	return list, nil
}
