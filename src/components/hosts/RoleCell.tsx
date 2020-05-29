import React from 'react';
import { RoleDropdown } from './RoleDropdown';
import { Host } from '../../api/types';

type RoleCellProps = {
  host: Host;
};

const canEditRole = (status: Host['status']) =>
  ['discovering', 'known', 'disconnected', 'disabled', 'insufficient'].includes(status);

const RoleCell: React.FC<RoleCellProps> = ({ host }) => {
  return canEditRole(host.status) ? <RoleDropdown host={host} /> : <>{host.role}</>;
};

export default RoleCell;
