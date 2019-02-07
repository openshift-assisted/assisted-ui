import React, { FC } from 'react';
import {
  Button,
  PageSectionVariants,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';

import PageSection from './ui/PageSection';

const ClusterWizardNav: FC = (): JSX.Element => (
  <PageSection variant={PageSectionVariants.light}>
    <Toolbar>
      <ToolbarGroup>
        <ToolbarItem>
          <Button variant="secondary">Back</Button>
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem>
          <Button variant="primary">Next</Button>
        </ToolbarItem>
      </ToolbarGroup>
    </Toolbar>
  </PageSection>
);

export default ClusterWizardNav;
