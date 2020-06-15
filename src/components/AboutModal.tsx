import React from 'react';
import {
  Button,
  AboutModal,
  TextContent,
  TextList,
  TextListItem,
  ButtonVariant,
} from '@patternfly/react-core';
import { GIT_SHA, VERSION } from '../config/standalone';
import redHatLogo from '../images/Logo-Red_Hat-OpenShift_Container_Platform-B-Reverse-RGB.png';

export const AboutModalButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const closeModal = () => setIsModalOpen(false);
  const handleClick = () => setIsModalOpen(true);
  return (
    <>
      <Button variant={ButtonVariant.plain} onClick={handleClick}>
        About
      </Button>
      <AboutModal
        isOpen={isModalOpen}
        onClose={closeModal}
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
          </TextList>
        </TextContent>
      </AboutModal>
    </>
  );
};

export default AboutModalButton;
