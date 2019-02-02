import React from 'react';
import { Avatar, Brand, PageHeader } from '@patternfly/react-core';
import avatarImg from '@patternfly/patternfly-next/assets/images/img_avatar.svg';
import logo from '../images/logo.svg';


const Header: React.FunctionComponent = (): React.ReactElement<
  React.ReactNode
> => (
  <PageHeader
    logo={<Brand src={logo} alt="RHHI.Next logo" />}
    // toolbar={PageToolbar}
    avatar={<Avatar src={avatarImg} alt="Avatar image" />}
    // showNavToggle
    // onNavToggle={this.onNavToggle}
  />
);

export default Header;
