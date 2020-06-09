import React from 'react';
import {
  Modal,
  Button,
  ButtonVariant,
  TextContent,
  Text,
  TextList,
  TextListItem,
  ModalVariant,
} from '@patternfly/react-core';
import { Cluster } from '../../api/types';
import { removeProtocolFromURL } from '../../api/utils';
import { ToolbarButton } from '../ui/Toolbar';

type WebConsoleHintProps = {
  cluster: Cluster;
  consoleUrl?: string;
};

type LaunchOpenshiftConsoleButtonProps = WebConsoleHintProps & {
  isDisabled: boolean;
};

type ConsoleModalProps = WebConsoleHintProps & {
  closeModal: () => void;
  isOpen: boolean;
};

export const WebConsoleHint: React.FC<WebConsoleHintProps> = ({ cluster, consoleUrl }) => (
  <TextContent>
    <Text component="p">
      In order to access the OpenShift Web Console, make sure your local or external DNS server is
      configured to resolve its hostname. To do so, either:
      <TextList>
        <TextListItem>
          Update your local /etc/hosts or /etc/resolve.conf files to resolve:
          <TextList>
            <TextListItem>
              <strong>{removeProtocolFromURL(consoleUrl)}</strong> to{' '}
              <strong>{cluster.ingressVip}</strong>
            </TextListItem>
            <TextListItem>
              <strong>{`oauth-openshift.apps.${cluster.name}.${cluster.baseDnsDomain}`}</strong> to{' '}
              <strong>{cluster.ingressVip}</strong>
            </TextListItem>
            <TextListItem>
              optionally
              <strong>{`api.${cluster.name}.${cluster.baseDnsDomain}`}</strong> to{' '}
              <strong>{cluster.apiVip}</strong>
            </TextListItem>
          </TextList>
        </TextListItem>
        <TextListItem>
          Contact your network administrator to configure this resolution in an external DNS server.
        </TextListItem>
      </TextList>
    </Text>
  </TextContent>
);

export const LaunchOpenshiftConsoleButton: React.FC<LaunchOpenshiftConsoleButtonProps> = ({
  cluster,
  consoleUrl,
  isDisabled,
}) => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <ToolbarButton
        type="button"
        variant={ButtonVariant.primary}
        isDisabled={isDisabled}
        onClick={() => setOpen(true)}
      >
        Launch OpenShift Console
      </ToolbarButton>
      <ConsoleModal
        closeModal={() => setOpen(false)}
        consoleUrl={consoleUrl}
        cluster={cluster}
        isOpen={isOpen}
      />
    </>
  );
};

export const ConsoleModal: React.FC<ConsoleModalProps> = ({
  closeModal,
  cluster,
  consoleUrl,
  isOpen,
}) => {
  const actions = [
    <Button
      type="submit"
      key="launch"
      variant={ButtonVariant.primary}
      onClick={() => window.open(consoleUrl, '_blank', 'noopener')}
      isDisabled={!consoleUrl}
    >
      Launch OpenShift Console
    </Button>,
    <Button variant={ButtonVariant.secondary} onClick={() => closeModal()} key="cancel">
      Cancel
    </Button>,
  ];

  return (
    <Modal
      title="OpenShift Web Console troubleshooting"
      isOpen={isOpen}
      onClose={closeModal}
      actions={actions}
      variant={ModalVariant.large}
    >
      <WebConsoleHint cluster={cluster} consoleUrl={consoleUrl} />
    </Modal>
  );
};
