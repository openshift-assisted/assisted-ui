import React from 'react';
import {
  Title,
  EmptyState,
  EmptyStateBody,
  Bullseye,
  EmptyStateIcon,
  IconProps,
  EmptyStateSecondaryActions,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

type Props = {
  title?: string;
  content?: React.ReactNode;
  icon?: string | React.FC<IconProps>;
  actions?: React.FC<React.ComponentProps<typeof EmptyStateSecondaryActions>>;
};

const TableEmptyState: React.FC<Props> = ({
  title = 'No results found',
  content,
  icon = SearchIcon,
  actions,
}) => (
  <Bullseye>
    <EmptyState>
      <EmptyStateIcon icon={icon} />
      <Title size="lg">{title}</Title>
      {content && <EmptyStateBody>{content}</EmptyStateBody>}
      {actions}
    </EmptyState>
  </Bullseye>
);

export default TableEmptyState;
