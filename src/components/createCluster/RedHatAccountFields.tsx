import React, { FC, Fragment } from 'react';
import { Field } from 'formik';
import { TextContent, Text } from '@patternfly/react-core';

import ExternalLink from '../ui/ExternalLink';
import { TextInput } from '../ui/formik';

interface RedHatAccountFieldsProps {
  onProvidePullSecret: () => void;
}

const RedHatAccountFields: FC<RedHatAccountFieldsProps> = ({
  onProvidePullSecret,
}: RedHatAccountFieldsProps): JSX.Element => (
  <Fragment>
    <TextContent>
      <Text component="p">
        Provide your Red Hat Account credentials to download necessary resources from{' '}
        <ExternalLink href="https://try.openshift.com/">try.openshift.com</ExternalLink> . You can
        also{' '}
        <Text component="a" onClick={onProvidePullSecret}>
          provide a Pull Secret
        </Text>{' '}
        instead.
      </Text>
    </TextContent>
    <Field
      component={TextInput}
      label="Username"
      id="create-cluster-username"
      name="username"
      isRequired
    />
    <Field
      component={TextInput}
      label="Password"
      id="create-cluster-password"
      name="password"
      type="password"
      isRequired
    />
  </Fragment>
);
export default RedHatAccountFields;
