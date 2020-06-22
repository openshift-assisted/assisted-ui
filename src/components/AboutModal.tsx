import React from 'react';
import {
  Button,
  AboutModal as PFAboutModal,
  TextContent,
  TextList,
  TextListItem,
  ButtonVariant,
} from '@patternfly/react-core';
import { GIT_SHA, VERSION, SERVICE_LABELS } from '../config/standalone';
import redHatLogo from '../images/Logo-Red_Hat-OpenShift_Container_Platform-B-Reverse-RGB.png';
import { Api } from 'facet-lib';

const { getVersions, handleApiError } = Api;

export const AboutModalButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const closeModal = () => setIsModalOpen(false);
  const handleClick = () => setIsModalOpen(true);
  return (
    <>
      <Button variant={ButtonVariant.plain} onClick={handleClick}>
        About
      </Button>
      <AboutModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

type AboutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [versions, setVersions] = React.useState<{ [key in string]: string }>({});

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getVersions();
        setVersions(data);
      } catch (e) {
        handleApiError(e);
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  return (
    <PFAboutModal
      isOpen={isOpen}
      onClose={onClose}
      productName="OpenShift Container Platform Assisted Installer"
      brandImageSrc={redHatLogo}
      brandImageAlt="Assisted Installer Logo"
    >
      <TextContent>
        <TextList component="dl">
          <TextListItem component="dt">Assisted Installer UI version</TextListItem>
          <TextListItem component="dd">
            {VERSION} {GIT_SHA ? `(${GIT_SHA})` : ''}
          </TextListItem>
          {Object.keys(versions).map((version) => (
            <>
              <TextListItem component="dt">{SERVICE_LABELS[version] || version}</TextListItem>
              <TextListItem component="dd">{versions[version]}</TextListItem>
            </>
          ))}
        </TextList>
      </TextContent>
    </PFAboutModal>
  );
};

export default AboutModalButton;
