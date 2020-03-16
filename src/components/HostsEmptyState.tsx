import React from 'react';
import { Title, EmptyState, EmptyStateBody, Bullseye } from '@patternfly/react-core';

const HostsEmptyState: React.FC = () => (
  <Bullseye>
    <EmptyState>
      <Title size="lg">No hosts connected</Title>
      <EmptyStateBody>
        Connect at least 3 hosts to your cluster to pool
        <br />
        together resources and start running workloads.
      </EmptyStateBody>
    </EmptyState>
  </Bullseye>
);

export default HostsEmptyState;
