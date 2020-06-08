import React from 'react';
import { Brand, PageHeader } from '@patternfly/react-core';
import metal3FacetLogo from '../../images/metal3_facet-whitetext.png';
import redhatLogo from '../../images/redhat.logo.png';
import { BRANDING } from '../../config/constants';

const getBrandingDetails = () => {
  switch (BRANDING) {
    case 'redhat':
      return {
        logo: redhatLogo,
        alt: 'Red Hat OpenShift',
        href: 'https://www.redhat.com',
      };
    default:
      return {
        logo: metal3FacetLogo,
        alt: 'Metal&sup3; Facet UI',
        href: 'https://github.com/openshift-metal3/facet',
      };
  }
};

const Header: React.FC = () => {
  const branding = getBrandingDetails();
  const logoProps = {
    href: branding.href,
    target: '_blank',
  };
  return (
    <PageHeader
      logo={<Brand src={branding.logo} alt={branding.alt} />}
      logoProps={logoProps}
      // toolbar={PageToolbar}
      //avatar={<Avatar src={avatarImg} alt="Avatar image" />}
      // showNavToggle
      // onNavToggle={this.onNavToggle}
    />
  );
};

export default Header;
