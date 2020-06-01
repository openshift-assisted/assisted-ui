import React from 'react';
import { RoleDropdown } from './RoleDropdown';
import { Host } from '../../api/types';
import { canEditRole } from './utils';

type RoleCellProps = {
  host: Host;
};

const RoleCell: React.FC<RoleCellProps> = ({ host }) => {
  return canEditRole(host.status) ? <RoleDropdown host={host} /> : <>{host.role}</>;
};

export default RoleCell;
