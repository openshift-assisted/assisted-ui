import React from 'react';
import { PageSectionVariants, DataToolbar, DataToolbarContent } from '@patternfly/react-core';
import PageSection from '../ui/PageSection';
import './ClusterToolbar.css';

interface Props {
  children: React.ReactNode;
}

const ClusterToolbar: React.FC<Props> = ({ children }) => (
  <PageSection variant={PageSectionVariants.light} className="pf-u-box-shadow-lg-top">
    <DataToolbar id="cluster-toolbar" className="cluster-toolbar">
      <DataToolbarContent>{children}</DataToolbarContent>
    </DataToolbar>
  </PageSection>
);

export default ClusterToolbar;
