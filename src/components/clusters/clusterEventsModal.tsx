import React from 'react';
import { Button, Modal } from '@patternfly/react-core';
import { ToolbarButton } from '../ui/Toolbar';
import EventListFetch from '../fetching/EventListFetch';
import { Cluster } from '../../api/types';

type ClusterEventsModalButtonProps = React.ComponentProps<typeof Button> & {
  ButtonComponent?: typeof Button | typeof ToolbarButton;
  onClick?: () => void;
  clusterId: Cluster['id'];
};

export const ClusterEventsModalButton: React.FC<ClusterEventsModalButtonProps> = ({
  ButtonComponent = ToolbarButton,
  onClick,
  clusterId,
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const closeModal = () => setIsModalOpen(false);
  const handleClick = onClick || (() => setIsModalOpen(true));
  return (
    <>
      <ButtonComponent {...props} onClick={handleClick}>
        View Cluster Events History
      </ButtonComponent>
      <ClusterEventsModal isOpen={isModalOpen} onClose={closeModal} clusterId={clusterId} />
    </>
  );
};

type ClusterEventsModalProps = {
  clusterId: Cluster['id'];
  onClose: () => void;
  isOpen: boolean;
};

export const ClusterEventsModal: React.FC<ClusterEventsModalProps> = ({
  clusterId,
  onClose,
  isOpen,
}) => {
  return (
    <Modal title="Cluster Events" isOpen={isOpen} onClose={onClose} isFooterLeftAligned isLarge>
      <EventListFetch entityId={clusterId} entityKind="cluster" />
    </Modal>
  );
};
