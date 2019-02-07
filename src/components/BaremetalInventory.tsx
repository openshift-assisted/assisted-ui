import React, { FC, Fragment } from 'react';

import {
  PageSectionVariants,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  Button
} from '@patternfly/react-core';
import PageSection from './ui/PageSection';
import HostsTable from './HostsTable';

const BaremetalInventory: FC = (): JSX.Element => (
  <Fragment>
    <PageSection variant={PageSectionVariants.darker}>
      Summary stats
    </PageSection>
    <PageSection variant={PageSectionVariants.light}>
      <Toolbar>
        <ToolbarGroup>
          <ToolbarItem>
            <Button variant="primary">Add Hosts</Button>
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    </PageSection>
    <PageSection
      variant={PageSectionVariants.light}
      isMain
      style={{ padding: 0 }}
    >
      <HostsTable />
    </PageSection>
  </Fragment>
);

export default BaremetalInventory;
