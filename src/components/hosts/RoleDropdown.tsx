import React from 'react';
import { Host } from '../../api/types';
import { SimpleDropdown } from '../ui/SimpleDropdown';
import { HostRole, HOST_ROLES } from '../../config/constants';
import { HostsRolesFieldContext } from './HostsRolesField';

type RoleDropdownProps = {
  host: Host;
};

export const RoleDropdown: React.FC<RoleDropdownProps> = ({ host }) => {
  const { id } = host;
  const { value, setValue } = React.useContext(HostsRolesFieldContext);

  const setRole = (role?: string) => setValue(host.id, role as HostRole);
  const current = value.find((v) => v.id === id)?.role;

  return <SimpleDropdown current={current} values={HOST_ROLES} setValue={setRole} />;
};
