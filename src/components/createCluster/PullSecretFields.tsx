import React, { FC, Fragment } from 'react';
import { Field } from 'formik';
import { TextContent, Text } from '@patternfly/react-core';

import ExternalLink from '../ui/ExternalLink';
import { TextArea } from '../ui/formik';

interface PullSecretFieldsProps {
  onProvideCredentials: () => void;
}

const PullSecretFields: FC<PullSecretFieldsProps> = ({
  onProvideCredentials
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
    <Field
      component={TextArea}
      label="Pull secret"
      name="pullSecret"
      id="create-cluster-pull-secret"
      aria-label="Pull secret"
      isRequired
    />
  </Fragment>
);
export default PullSecretFields;
