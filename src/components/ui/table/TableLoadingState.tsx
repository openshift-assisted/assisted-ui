import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  Bullseye,
  EmptyStateVariant,
  Spinner,
} from '@patternfly/react-core';

type Props = {
  content?: React.ReactNode;
};

const TableLoadingState: React.FC<Props> = ({ content }) => (
  <Bullseye>
    <EmptyState variant={EmptyStateVariant.small}>
      <Spinner size="xl" />
      {content && <EmptyStateBody>{content}</EmptyStateBody>}
    </EmptyState>
  </Bullseye>
);

export default TableLoadingState;
