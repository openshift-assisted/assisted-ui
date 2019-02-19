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

// This structure not a complete example of ironic introspection data.
// To be completed as needed as we go...
type IntrospectionData struct {
	Name      string    `json:"name"`
	Inventory Inventory `json:"inventory"`
}

type Inventory struct {
	Disks []Disk `json:"disks"`
}

type Disk struct {
	ByPath             string `json:"by_path"`
	Model              string `json:"model"`
	Name               string `json:"name"`
	Rotational         bool   `json:"rotational"`
	Serial             string `json:"serial"`
	Size               int    `json:"size"`
	Vendor             string `json:"vendor"`
	Wwn                string `json:"wwn"`
	WwnVendorExtension string `json:"wwn_vendor_extension"`
	WwnWithExtension   string `json:"wwn_with_extension"`
}

func GetIntrospectionData(host string) (IntrospectionData, error) {
    hostsIntrospectionData := []IntrospectionData{
        IntrospectionData{
            Name: "host-01",
            Inventory: Inventory{
                Disks: []Disk{
                    Disk{
                        ByPath:             "/dev/disk/by-path/pci-0000:00:05.0",
                        Name:               "/dev/vda/",
                        Model:              "",
                        Rotational:         true,
                        Serial:             "",
                        Size:               53687091200,
                        Vendor:             "0x1af4",
                        Wwn:                "",
                        WwnVendorExtension: "",
                        WwnWithExtension:   "",
                    },
                },
            },
        },
        IntrospectionData{
            Name: "host-02",
            Inventory: Inventory{
                Disks: []Disk{
                    Disk{
                        ByPath:             "/dev/disk/by-path/pci-0000:00:05.0",
                        Name:               "/dev/vda/",
                        Model:              "",
                        Rotational:         true,
                        Serial:             "",
                        Size:               10737418240,
                        Vendor:             "0x1af4",
                        Wwn:                "",
                        WwnVendorExtension: "",
                        WwnWithExtension:   "",
                    },
                },
            },
        },
    }

    returnData := hostsIntrospectionData[0];

    for _, data := range hostsIntrospectionData {
        if data.Name == host {
            returnData = data
        }
    }

    return returnData, nil


}
