import React from 'react';
import { Brand, PageHeader } from '@patternfly/react-core';
import logo from '../../images/logo.svg';

const Header: React.FunctionComponent = (): React.ReactElement<
  React.ReactNode
> => (
  <PageHeader
    logo={<Brand src={logo} alt="MetalKube Facet UI" />}
    // toolbar={PageToolbar}
    //avatar={<Avatar src={avatarImg} alt="Avatar image" />}
    // showNavToggle
    // onNavToggle={this.onNavToggle}
  />
);

export default Header;
