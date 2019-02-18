import React, { FC } from 'react';
import { PageSectionVariants, Toolbar } from '@patternfly/react-core';

import PageSection from './ui/PageSection';

interface Props {
  children: React.ReactNode;
}

const ClusterWizardToolbar: FC<Props> = ({ children }: Props): JSX.Element => (
  <PageSection
    variant={PageSectionVariants.light}
    className="pf-u-box-shadow-lg-top"
  >
    <Toolbar>{children}</Toolbar>
  </PageSection>
);

export default ClusterWizardToolbar;
