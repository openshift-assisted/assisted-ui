import React from 'react';
import { saveAs } from 'file-saver';
import {
  GridItem,
  TextContent,
  ButtonVariant,
  Button,
  ClipboardCopy,
  clipboardCopyFunc,
  Popover,
} from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon, InfoCircleIcon } from '@patternfly/react-icons';

import { getClusterFileURL } from '../../api/clusters';
import { LoadingState, ErrorState } from '../ui/uiState';
import { Credentials, Cluster } from '../../api/types';
import { WebConsoleHint } from './ConsoleModal';

type ClusterCredentialsProps = {
  cluster: Cluster;
  error: boolean;
  retry: () => void;
  credentials?: Credentials;
};

const ClusterCredentials: React.FC<ClusterCredentialsProps> = ({
  cluster,
  credentials,
  error,
  retry,
}) => {
  let credentialsBody: JSX.Element;
  if (error) {
    credentialsBody = <ErrorState title="Failed to fetch cluster credentials." fetchData={retry} />;
  } else if (!credentials) {
    credentialsBody = <LoadingState />;
  } else {
    credentialsBody = (
      <TextContent>
        <dl className="cluster-detail__details-list">
          <dt>Web Console URL</dt>
          <dd>
            <Button
              variant="link"
              icon={<ExternalLinkSquareAltIcon />}
              iconPosition="right"
              isInline
              onClick={() => window.open(credentials.consoleUrl, '_blank', 'noopener')}
            >
              {credentials.consoleUrl}
            </Button>
            <br />
            <Popover
              headerContent={<div>OpenShift Web Console troubleshooting</div>}
              bodyContent={<WebConsoleHint cluster={cluster} consoleUrl={credentials.consoleUrl} />}
              minWidth="45rem"
            >
              <Button variant="link" icon={<InfoCircleIcon />} iconPosition="left" isInline>
                Not able to access the Web Console?
              </Button>
            </Popover>
          </dd>
          <dt>Username</dt>
          <dd>{credentials.username}</dd>
          <dt>Password</dt>
          <dd>
            <ClipboardCopy
              isReadOnly
              onCopy={(event) => clipboardCopyFunc(event, credentials.password)}
            >
              &bull;&bull;&bull;&bull;&bull;
            </ClipboardCopy>
          </dd>
        </dl>
      </TextContent>
    );
  }

  return (
    <GridItem span={12} lg={10} xl={6}>
      <div>
        {credentialsBody}
        <Button
          variant={ButtonVariant.secondary}
          onClick={() => saveAs(getClusterFileURL(cluster.id, 'kubeconfig'))}
        >
          Download kubeconfig
        </Button>
      </div>
    </GridItem>
  );
};

export default ClusterCredentials;
