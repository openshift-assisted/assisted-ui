import React, { FC } from 'react';

import { ToolbarGroup, ToolbarItem, Text } from '@patternfly/react-core';

const ToolbarText: FC<React.ComponentProps<typeof Text>> = (
  props: React.ComponentProps<typeof Text>,
): JSX.Element => (
  <ToolbarGroup>
    <ToolbarItem>
      <Text {...props} />
    </ToolbarItem>
  </ToolbarGroup>
);

export default ToolbarText;
