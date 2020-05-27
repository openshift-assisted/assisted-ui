import React from 'react';
import { saveAs } from 'file-saver';
import { GridItem, TextContent, ButtonVariant, Button } from '@patternfly/react-core';

import { Cluster } from '../../api/types';
import { getClusterFileURL } from '../../api/clusters';

type ClusterCredentialsProps = {
  cluster: Cluster;
};

const ClusterCredentials: React.FC<ClusterCredentialsProps> = ({ cluster }) => {
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
      <Button
        variant={ButtonVariant.secondary}
        onClick={() => saveAs(getClusterFileURL(cluster.id, 'kubeconfig'))}
      >
        Download kubeconfig
      </Button>
    </GridItem>
  );
};

export default ClusterCredentials;
