import React, { FC, CSSProperties } from 'react';
import {
  PageSection as PfPageSection,
  StackItem
} from '@patternfly/react-core';

interface PageSectionProps extends React.ComponentProps<typeof PfPageSection> {
  isMain?: boolean;
  style?: CSSProperties;
}

const scrollableStyle: CSSProperties = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  overflow: 'auto',
  zIndex: 0,
  display: 'flex',
  flexDirection: 'column'
};

const PageSection: FC<PageSectionProps> = ({
  isMain = false,
  style,
  ...rest
}: PageSectionProps): JSX.Element => {
  const resultStyle = isMain ? { ...style, ...scrollableStyle } : { ...style };
  return (
    <StackItem isMain={isMain} style={{ position: 'relative' }}>
      <PfPageSection style={resultStyle} {...rest} />
    </StackItem>
  );
};

export default PageSection;
