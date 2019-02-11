import React, { FC, ReactNode } from 'react';
import { Text } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

interface ExternalLinkProps {
  href: string;
  children?: ReactNode;
}
const ExternalLink: FC<ExternalLinkProps> = ({
  href,
  children,
  ...rest
}: ExternalLinkProps): JSX.Element => (
  <Text component="a" href={href} target="_blank" {...rest}>
    {children ? children : href}{' '}
    <ExternalLinkAltIcon color="rgb(0, 123, 186)" />
  </Text>
);
export default ExternalLink;
