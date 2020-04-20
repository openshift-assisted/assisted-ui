import React from 'react';
import { Popover, Button, ButtonVariant } from '@patternfly/react-core';

type HostStatus =
  | 'discovering'
  | 'known'
  | 'disconnected'
  | 'insufficient'
  | 'disabled'
  | 'installing'
  | 'installed';

const statusTitles = {
  discovering: 'Discovering',
  known: 'Known',
  disconnected: 'Disconnected',
  insufficient: 'Insufficient',
  disabled: 'Disabled',
  installing: 'Installing',
  installed: 'Installed',
};

type HostStatusProps = {
  status: HostStatus;
  statusInfo?: string;
};

const HostStatus: React.FC<HostStatusProps> = ({ status, statusInfo }) => {
  const title = statusTitles[status] || status;
  if (statusInfo) {
    return (
      <Popover headerContent={<div>{title}</div>} bodyContent={<div>{statusInfo}</div>}>
        <Button variant={ButtonVariant.link} isInline>
          {title}
        </Button>
      </Popover>
    );
  }
  return <>{title}</>;
};

export default HostStatus;
