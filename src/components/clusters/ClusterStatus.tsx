import React from 'react';
import { Popover, Button, ButtonVariant } from '@patternfly/react-core';
import {
  global_danger_color_100 as dangerColor,
  global_warning_color_100 as warningColor,
  global_success_color_200 as okColor,
} from '@patternfly/react-tokens';
import {
  ExclamationCircleIcon,
  WarningTriangleIcon,
  CheckCircleIcon,
  UnknownIcon,
  InProgressIcon,
} from '@patternfly/react-icons';
import { Cluster } from '../../api/types';
import { CLUSTER_STATUS_LABELS } from '../../config/constants';
import { getHumanizedDateTime } from '../ui/utils';

const getStatusIcon = (status: Cluster['status']) => {
  if (status === 'insufficient') return <WarningTriangleIcon color={warningColor.value} />;
  if (status === 'ready') return <CheckCircleIcon color={okColor.value} />;
  if (status === 'installing') return <InProgressIcon />;
  if (status === 'error') return <ExclamationCircleIcon color={dangerColor.value} />;
  if (status === 'installed') return <CheckCircleIcon color={okColor.value} />;
  return <UnknownIcon />;
};

type ClusterStatusProps = {
  cluster: Cluster;
};

const ClusterStatus: React.FC<ClusterStatusProps> = ({ cluster }) => {
  const { status, statusInfo, statusUpdatedAt } = cluster;
  const title = CLUSTER_STATUS_LABELS[status];
  const icon = getStatusIcon(status);
  const headerContent = React.useMemo(() => <div>{title}</div>, [title]);
  const bodyContent = React.useMemo(() => <div>{statusInfo}</div>, [statusInfo]);
  const footerContent = React.useMemo(
    () => <small>Status updated at {getHumanizedDateTime(statusUpdatedAt)}</small>,
    [statusUpdatedAt],
  );
  if (statusInfo) {
    return (
      <Popover
        headerContent={headerContent}
        bodyContent={bodyContent}
        footerContent={footerContent}
        minWidth="30rem"
        maxWidth="50rem"
      >
        <Button variant={ButtonVariant.link} isInline>
          {icon} {title}
        </Button>
      </Popover>
    );
  }
  return (
    <>
      {icon} {title}
    </>
  );
};

export default ClusterStatus;
