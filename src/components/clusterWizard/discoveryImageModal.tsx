import React from 'react';
import { Modal, Button, ButtonVariant, Form, TextContent, Text } from '@patternfly/react-core';
import { ToolbarButton } from '../ui/Toolbar';
import { InputField } from '../ui/formik';
import { Formik } from 'formik';
import useApi from '../../api/useApi';
import { getCluster, patchCluster } from '../../api/clusters';
import { ResourceUIState } from '../../types';
import { useParams } from 'react-router-dom';
import { LoadingState } from '../ui/uiState';

type DiscoveryImageModalButtonProps = {
  ButtonComponent?: typeof Button | typeof ToolbarButton;
};

export const DiscoveryImageModalButton: React.FC<DiscoveryImageModalButtonProps> = ({
  ButtonComponent = Button,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const closeModal = () => setIsModalOpen(false);
  return (
    <>
      <ButtonComponent variant={ButtonVariant.primary} onClick={() => setIsModalOpen(true)}>
        Download discovery ISO
      </ButtonComponent>
      {isModalOpen && <DiscoveryImageModal closeModal={closeModal} />}
    </>
  );
};

type DiscoveryImageModalProps = {
  closeModal: () => void;
};

export const DiscoveryImageModal: React.FC<DiscoveryImageModalProps> = ({ closeModal }) => {
  const { clusterId } = useParams();
  const [{ data: cluster, uiState }] = useApi(getCluster, clusterId);
  console.log('CLUSTER', cluster);

  const [{ data, uiState: submitUIState }, updateCluster] = useApi(patchCluster, undefined, {
    manual: true,
    initialUIState: ResourceUIState.LOADED,
  });

  const handleSubmit = (values: any) => {
    debugger;
    patchCluster(clusterId, values);
  };

  return (
    <Modal
      title="Configure discovery ISO"
      isOpen={true}
      onClose={closeModal}
      actions={[
        <Button key="confirm" variant="primary" onClick={closeModal}>
          Download discovery ISO
        </Button>,
        <Button key="cancel" variant="link" onClick={closeModal}>
          Cancel
        </Button>,
      ]}
      isFooterLeftAligned
      isSmall
    >
      {uiState === ResourceUIState.LOADING ? (
        <LoadingState />
      ) : (
        <Formik
          initialValues={{ proxyIp: '', proxyPort: '' }}
          initialStatus={{ error: null }}
          // validate={validate}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, isSubmitting, isValid, submitForm, status }) => (
            <Form onSubmit={handleSubmit}>
              <TextContent>
                <Text component="p">
                  Provide configuration for discovery image so the hosts which boot the image can
                  access the internet
                </Text>
              </TextContent>
              <InputField label="Proxy IP" name="proxyIp" />
              <InputField label="Proxy port" name="proxyPort" />
              <Button type="submit">Submit</Button>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
};
