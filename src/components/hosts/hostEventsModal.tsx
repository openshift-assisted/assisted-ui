import React from 'react';
import { Button, Modal } from '@patternfly/react-core';
import { ToolbarButton } from '../ui/Toolbar';
import EventListFetch from '../fetching/EventListFetch';
import { Host } from '../../api/types';

type HostEventsModalButtonProps = React.ComponentProps<typeof Button> & {
  ButtonComponent?: typeof Button | typeof ToolbarButton;
  onClick?: () => void;
  hostId: Host['id'];
};

export const HostEventsModalButton: React.FC<HostEventsModalButtonProps> = ({
  ButtonComponent = Button,
  onClick,
  hostId,
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const closeModal = () => setIsModalOpen(false);
  const handleClick = onClick || (() => setIsModalOpen(true));
  return (
    <>
      <ButtonComponent {...props} onClick={handleClick}>
        View Host Events History
      </ButtonComponent>
      <HostEventsModal isOpen={isModalOpen} onClose={closeModal} hostId={hostId} />
    </>
  );
};

type HostEventsModalProps = {
  hostId: Host['id'];
  onClose: () => void;
  isOpen: boolean;
};

export const HostEventsModal: React.FC<HostEventsModalProps> = ({ hostId, onClose, isOpen }) => {
  return (
    <Modal title="Host Events" isOpen={isOpen} onClose={onClose} isFooterLeftAligned isLarge>
      <EventListFetch entityId={hostId} entityKind="cluster" />
    </Modal>
  );
};
