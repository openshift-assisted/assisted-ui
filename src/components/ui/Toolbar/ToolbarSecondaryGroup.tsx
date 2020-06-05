import React from 'react';
import { DataToolbarItem, DataToolbarItemVariant, DataToolbarGroup } from '@patternfly/react-core';

const ToolbarSecondaryGroup: React.FC = ({ children }) => (
  <>
    <DataToolbarItem
      variant={DataToolbarItemVariant.separator}
      breakpointMods={[{ modifier: 'hidden', breakpoint: 'md' }]}
    />
    <DataToolbarGroup breakpointMods={[{ modifier: 'align-right', breakpoint: 'md' }]}>
      {children}
    </DataToolbarGroup>
  </>
);

export default ToolbarSecondaryGroup;
