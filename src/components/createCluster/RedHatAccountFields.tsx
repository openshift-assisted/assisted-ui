import React, { FC, Fragment } from 'react';
import {
  FormGroup,
  TextInput,
  TextContent,
  Text
} from '@patternfly/react-core';

import ExternalLink from '../ui/ExternalLink';

interface RedHatAccountFieldsProps {
  onProvidePullSecret: () => void;
  handleUsernameChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  username: string;
  password: string;
}

const RedHatAccountFields: FC<RedHatAccountFieldsProps> = ({
  onProvidePullSecret,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}: RedHatAccountFieldsProps): JSX.Element => (
  <Fragment>
    <TextContent>
      <Text component="p">
        Provide your Red Hat Account credentials to download necessary resources
        from{' '}
        <ExternalLink href="https://try.openshift.com/">
          try.openshift.com
        </ExternalLink>{' '}
        . You can also{' '}
        <Text component="a" onClick={onProvidePullSecret}>
          provide a Pull Secret
        </Text>{' '}
        instead.
      </Text>
    </TextContent>
    <FormGroup label="Username" fieldId="create-cluster-username" isRequired>
      <TextInput
        type="text"
        id="create-cluster-username"
        name="username"
        aria-describedby="create-cluster-username-helper"
        value={username}
        onChange={handleUsernameChange}
        isRequired
      />
    </FormGroup>
    <FormGroup label="Password" fieldId="create-cluster-password" isRequired>
      <TextInput
        type="text"
        id="create-cluster-password-domain"
        name="password"
        aria-describedby="create-cluster-password-helper"
        value={password}
        onChange={handlePasswordChange}
        isRequired
      />
    </FormGroup>
  </Fragment>
);
export default RedHatAccountFields;
