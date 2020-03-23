import React from 'react';
import {
  Title,
  EmptyState,
  EmptyStateBody,
  Bullseye,
  EmptyStateIcon,
  IconProps,
  EmptyStateSecondaryActions,
  Button,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

type Props = {
  title?: string;
  content?: React.ReactNode;
  icon?: string | React.FC<IconProps>;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode[];
};

const TableEmptyState: React.FC<Props> = ({
  title = 'No results found',
  content,
  icon = SearchIcon,
  primaryAction,
  secondaryActions,
}) => (
  <Bullseye>
    <EmptyState>
      <EmptyStateIcon icon={icon} />
      <Title size="lg">{title}</Title>
      {content && <EmptyStateBody>{content}</EmptyStateBody>}
      {primaryAction}
      {secondaryActions && (
        <EmptyStateSecondaryActions>{secondaryActions}</EmptyStateSecondaryActions>
      )}
    </EmptyState>
  </Bullseye>
);

export default TableEmptyState;
