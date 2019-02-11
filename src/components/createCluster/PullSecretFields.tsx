import React, { FC, Fragment } from 'react';
import { FormGroup, TextArea, TextContent, Text } from '@patternfly/react-core';

import ExternalLink from '../ui/ExternalLink';

interface PullSecretFieldsProps {
  onProvideCredentials: () => void;
  handlePullSecretChange: (value: string) => void;
  pullSecret: string;
}

const PullSecretFields: FC<PullSecretFieldsProps> = ({
  onProvideCredentials,
  handlePullSecretChange,
  pullSecret
}: PullSecretFieldsProps): JSX.Element => (
  <Fragment>
    <TextContent>
      <Text component="p">
        Provide your Red Hat Account Pull Secret from{' '}
        <ExternalLink href="https://try.openshift.com/">
          try.openshift.com
        </ExternalLink>{' '}
        to download necessary resources. You can also{' '}
        <Text component="a" onClick={onProvideCredentials}>
          provide your credentials
        </Text>{' '}
        instead.
      </Text>
    </TextContent>
    <FormGroup
      label="Pull secret"
      fieldId="create-cluster-pull-secret"
      isRequired
    >
      <TextArea
        id="create-cluster-pull-secret"
        name="pullSecret"
        value={pullSecret}
        onChange={handlePullSecretChange}
        aria-label="Pull secret"
        isRequired
      />
    </FormGroup>
  </Fragment>
);
export default PullSecretFields;
