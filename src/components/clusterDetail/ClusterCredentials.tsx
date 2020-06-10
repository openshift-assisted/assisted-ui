import React from 'react';
import {
  GridItem,
  TextContent,
  Button,
  ClipboardCopy,
  clipboardCopyFunc,
  Popover,
} from '@patternfly/react-core';
import { InfoCircleIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

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
              icon={<ExternalLinkAltIcon />}
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
      {credentialsBody}
    </GridItem>
  );
};

export default ClusterCredentials;
