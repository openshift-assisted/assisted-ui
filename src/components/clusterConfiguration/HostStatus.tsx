import React from 'react';
import { Popover, Button, ButtonVariant } from '@patternfly/react-core';
import {
  global_danger_color_100 as dangerColor,
  global_warning_color_100 as warningColor,
  global_success_color_200 as okColor,
} from '@patternfly/react-tokens';
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  WarningTriangleIcon,
  InProgressIcon,
  DisconnectedIcon,
  ConnectedIcon,
  OffIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
import { Host } from '../../api/types';
import HostProgress from '../clusterDetail/HostProgress';
import { HOST_STATUS_LABELS } from '../../config/constants';

import './HostStatus.css';

const getStatusIcon = (status: Host['status']) => {
  if (status === 'discovering') return <ConnectedIcon />;
  if (status === 'known') return <CheckCircleIcon color={okColor.value} />;
  if (status === 'disconnected') return <DisconnectedIcon />;
  if (status === 'disabled') return <OffIcon />;
  if (status === 'insufficient') return <WarningTriangleIcon color={warningColor.value} />;
  if (status === 'installing') return <InProgressIcon />;
  if (status === 'installing-in-progress') return <InProgressIcon />;
  if (status === 'error') return <ExclamationCircleIcon color={dangerColor.value} />;
  if (status === 'installed') return <CheckCircleIcon color={okColor.value} />;
  return <UnknownIcon />;
};

type HostStatusProps = {
  status: Host['status'];
  statusInfo?: string;
  // progressInfo?: Host['progressInfo'] // TODO(jtomasek): enable this once progressInfo is available
  progressInfo?: {
    steps: string[];
    currentStep: string;
  };
};

const HostStatus: React.FC<HostStatusProps> = ({ status, statusInfo }) => {
  const title = HOST_STATUS_LABELS[status] || status;
  const icon = getStatusIcon(status);

  // TODO(jtomasek): mocked steps, remove when progressInfo is available
  const installationSteps = [
    'Starting installation',
    'Writing image to disk',
    'Installing as <node role>',
    'Rebooting',
  ];
  const progressInfo = {
    steps: installationSteps,
    currentStep: statusInfo || 'Starting Installation',
  };

  const currentStepNumber = progressInfo.steps.indexOf(progressInfo.currentStep) + 1;
  const headerContent = React.useMemo(() => <div>{title}</div>, [title]);
  const bodyContent = React.useMemo(
    () => (
      <div>
        {['installing', 'installing-in-progress'].includes(status) ? (
          <>
            <HostProgress status={status} progressInfo={progressInfo} />
            <br />
          </>
        ) : (
          statusInfo
        )}
      </div>
    ),
    [status, progressInfo, statusInfo],
  );
  return (
    <>
      <Popover
        headerContent={headerContent}
        bodyContent={bodyContent}
        minWidth="30rem"
        maxWidth="50rem"
      >
        <Button variant={ButtonVariant.link} className="host-status__button" isInline>
          {icon} {title}{' '}
          {['installing', 'installing-in-progress'].includes(status) && (
            <>
              {currentStepNumber}/{progressInfo.steps.length}
            </>
          )}
        </Button>
      </Popover>
    </>
  );
};

export default HostStatus;
