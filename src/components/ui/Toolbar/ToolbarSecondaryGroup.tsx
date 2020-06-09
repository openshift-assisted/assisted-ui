import React from 'react';
import { ToolbarItem, ToolbarItemVariant, ToolbarGroup } from '@patternfly/react-core';

const ToolbarSecondaryGroup: React.FC = ({ children }) => (
  <>
    <ToolbarItem variant={ToolbarItemVariant.separator} visiblity={{ md: 'hidden' }} />
    <ToolbarGroup alignment={{ md: 'alignRight' }}>{children}</ToolbarGroup>
  </>
);

export default ToolbarSecondaryGroup;
