import React from 'react';
import { Cluster } from '../../api/types';
import { GridItem, TextContent, ButtonVariant, Button } from '@patternfly/react-core';

type ClusterCredentialsProps = {
  cluster: Cluster;
};

const ClusterCredentials: React.FC<ClusterCredentialsProps> = () => {
  // TODO(jtomasek): Fetch cluster credentials data
  // TODO(jtomasek):
  return (
    <GridItem>
      <TextContent>
        <dl className="cluster-detail__details-list">
          <dt>Web Console URL</dt>
          <dd>https://console-openshift-console.apps.clusterName.dev.domain.com</dd>
          <dt>Username</dt>
          <dd>kubeadmin</dd>
          <dt>Password</dt>
          <dd>-------------</dd>
        </dl>
      </TextContent>
      <Button variant={ButtonVariant.secondary} isDisabled>
        Download kubeconfig
      </Button>
    </GridItem>
  );
};

export default ClusterCredentials;
