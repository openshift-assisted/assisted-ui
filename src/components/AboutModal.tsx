import React from 'react';
import {
  Button,
  AboutModal as PFAboutModal,
  TextContent,
  ButtonVariant,
} from '@patternfly/react-core';
import { GIT_SHA, VERSION, SERVICE_LABELS } from '../config/standalone';
import redHatLogo from '../images/Logo-Red_Hat-OpenShift_Container_Platform-B-Reverse-RGB.png';
import { Api, DetailList, DetailItem } from 'facet-lib';

const { getVersions, handleApiError } = Api;

export const AboutModalButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const closeModal = () => setIsModalOpen(false);
  const handleClick = () => setIsModalOpen(true);
  return (
    <>
      <Button variant={ButtonVariant.plain} onClick={handleClick} id="button-about">
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
        <DetailList>
          <>
            <DetailItem
              title="Assisted Installer UI version"
              value={`${VERSION} ${GIT_SHA ? `(${GIT_SHA})` : ''}`}
            />
            {Object.keys(versions).map((version) => (
              <DetailItem
                key={version}
                title={SERVICE_LABELS[version] || version}
                value={versions[version]}
              />
            ))}
          </>
        </DetailList>
      </TextContent>
    </PFAboutModal>
  );
};

export default AboutModalButton;
