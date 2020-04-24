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
// import { saveAs } from 'file-saver';
import { ToolbarButton } from '../ui/Toolbar';
import { InputField, TextAreaField } from '../ui/formik';
import { Formik, FormikHelpers } from 'formik';
// import useApi from '../../api/useApi';
import { GetClusterDownloadsImageParams } from '../../api/clusters';
// import { ResourceUIState } from '../../types';
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

  // const [{ data, uiState }, downloadImage] = useApi(getClusterDownloadsImage, undefined, {
  //   manual: true,
  //   initialUIState: ResourceUIState.LOADED,
  // });
  // console.log('DATA', data);
  // console.log('DATATYPE', typeof data);

  // React.useEffect(() => {
  //   if (data) saveAs(data, 'discoveryImage.iso');
  // }, [data]);

  const handleSubmit = (
    values: GetClusterDownloadsImageParams,
    actions: FormikHelpers<GetClusterDownloadsImageParams>,
  ) => {
    actions.setSubmitting(true);
    // clusterId && downloadImage([clusterId, values]);
  };

  return (
    <Modal
      title="Configure discovery ISO"
      isOpen={true}
      onClose={closeModal}
      // actions={[
      //   <Button
      //     key="confirm"
      //     variant="primary"
      //     href={`/api/bm-inventory/v1/clusters/${clusterId}/downloads/image`}
      //     component="a"
      //     download="discovery.iso"
      //     onClick={() => setSubmitting(true)}
      //   >
      //     Download discovery ISO
      //   </Button>,
      //   <Button key="cancel" variant="link" onClick={closeModal}>
      //     Cancel
      //   </Button>,
      // ]}
      isFooterLeftAligned
      isSmall
    >
      <Formik
        initialValues={
          { proxyIp: '', proxyPort: '', sshPublicKey: '' } as GetClusterDownloadsImageParams
        }
        initialStatus={{ error: null }}
        // validate={validate}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form
            action={`/api/bm-inventory/v1/clusters/${clusterId}/downloads/image`}
            method="get"
            onSubmit={() => handleSubmit()}
          >
            {isSubmitting ? (
              <LoadingState
                content="Discovery image is being prepared, the download will start in a moment."
                secondaryActions={[
                  <Button key="close" variant={ButtonVariant.secondary} onClick={closeModal}>
                    Close
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
