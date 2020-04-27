import React from 'react';
import {
  Modal,
  Button,
  ButtonVariant,
  Form,
  TextContent,
  Text,
  ModalBoxFooter,
} from '@patternfly/react-core';
import { saveAs } from 'file-saver';
import { ToolbarButton } from '../ui/Toolbar';
import { InputField, TextAreaField } from '../ui/formik';
import { Formik, FormikHelpers } from 'formik';
import { createClusterDownloadsImage, getClusterDownloadsImageUrl } from '../../api/clusters';
import { useParams } from 'react-router-dom';
import { LoadingState } from '../ui/uiState';
import { ImageCreateParams } from '../../api/types';

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

  const handleSubmit = async (
    values: ImageCreateParams,
    formikActions: FormikHelpers<ImageCreateParams>,
  ) => {
    if (clusterId) {
      try {
        const {
          data: { imageId },
        } = await createClusterDownloadsImage(clusterId, values);
        saveAs(getClusterDownloadsImageUrl(clusterId, imageId), `discovery-image-${clusterId}.iso`);
        closeModal();
      } catch (e) {
        formikActions.setStatus({ error: 'Failed to download the discovery Image' });
        console.error(e);
        console.error('Response data:', e.response?.data);
      }
    }
  };

  return (
    <Modal
      title="Download discovery ISO"
      isOpen={true}
      onClose={closeModal}
      isFooterLeftAligned
      isSmall
    >
      <Formik
        initialValues={{ proxyIp: '', proxyPort: undefined, sshPublicKey: '' } as ImageCreateParams}
        initialStatus={{ error: null }}
        // validate={validate}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            {isSubmitting ? (
              <LoadingState
                content="Discovery image is being prepared, the download will start in a moment."
                secondaryActions={[
                  <Button key="close" variant={ButtonVariant.secondary} onClick={closeModal}>
                    Cancel
                  </Button>,
                ]}
              />
            ) : (
              <>
                <TextContent>
                  <Text component="p">
                    Provide configuration for discovery image so the hosts which boot the image can
                    access the internet to register as a cluster inventory.
                  </Text>
                </TextContent>
                <InputField
                  label="Proxy IP"
                  name="proxyIp"
                  helperText="The IP address of the HTTP proxy that agents should use to access the discovery service"
                />
                <InputField
                  label="Proxy port"
                  name="proxyPort"
                  helperText="The port of the HTTP proxy"
                />
                <TextAreaField
                  label="SSH public key"
                  name="sshPublicKey"
                  helperText="SSH public key for debugging the installation"
                />
                <ModalBoxFooter isLeftAligned>
                  <Button key="submit" type="submit">
                    Download Discovery ISO
                  </Button>
                  <Button key="cancel" variant="link" onClick={closeModal}>
                    Cancel
                  </Button>
                </ModalBoxFooter>
              </>
            )}
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
