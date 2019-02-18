import React, { FC } from 'react';

import {
  ToolbarGroup,
  ToolbarItem,
  Progress,
  ProgressSize
} from '@patternfly/react-core';

const ToolbarProgress: FC<React.ComponentProps<typeof Progress>> = ({
  style,
  size = ProgressSize.sm,
  ...rest
}: React.ComponentProps<typeof Progress>): JSX.Element => (
  <ToolbarGroup style={{ flexGrow: 1 }}>
    <ToolbarItem style={{ flexGrow: 1 }}>
      <Progress style={{ ...style, gridGap: 0 }} size={size} {...rest} />
    </ToolbarItem>
  </ToolbarGroup>
);

export default ToolbarProgress;
