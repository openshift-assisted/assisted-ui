import React from 'react';
import { Host, ClusterUpdateParams } from '../../api/types';
import { SimpleDropdown } from '../ui/SimpleDropdown';
import { patchCluster } from '../../api/clusters';
import { HostRolesType, HOST_ROLES } from '../../config/constants';

type RoleDropdownProps = {
  role: Host['role'];
  host: Host;
};

export const RoleDropdown: React.FC<RoleDropdownProps> = ({ role, host }) => {
  const [isDisabled, setDisabled] = React.useState(false);

  const setRole = async (role?: string) => {
    const params: ClusterUpdateParams = {};
    setDisabled(true);
    params.hostsRoles = [
      {
        id: host.id,
        role: role as HostRolesType,
      },
    ];
    // TODO(mlibra): store updatedCluster (infra WIP) or initiate reload
    // const updatedCluster =
    await patchCluster(host.clusterId as string, params);
    setDisabled(false);
  };

  return (
    <SimpleDropdown
      current={role as string}
      values={HOST_ROLES}
      setValue={setRole}
      isDisabled={isDisabled}
    />
  );
};
