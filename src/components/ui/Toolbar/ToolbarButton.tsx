import React, { FC } from 'react';

import { ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';

const ToolbarProgress: FC<React.ComponentProps<typeof Button>> = (
  props: React.ComponentProps<typeof Button>
): JSX.Element => (
  <ToolbarGroup>
    <ToolbarItem>
      <Button {...props} />
    </ToolbarItem>
  </ToolbarGroup>
);

export default ToolbarProgress;
