import React, { Component } from 'react';
import {
  Form,
  FormGroup,
  Grid,
  GridItem,
  TextInput,
  PageSectionVariants,
  TextContent,
  Text
} from '@patternfly/react-core';

import RedHatAccountFields from './RedHatAccountFields';
import PageSection from '../ui/PageSection';
import PullSecretFields from './PullSecretFields';

interface FormState {
  clusterName: string;
  DNSDomain: string;
  username: string;
  password: string;
  pullSecret: string;
}

export interface CreateClusterFormState {
  providePullSecret: boolean;
  form: FormState;
}

class CreateClusterForm extends Component<{}, CreateClusterFormState> {
  state: CreateClusterFormState = {
    providePullSecret: false,
    form: {
      clusterName: '',
      DNSDomain: '',
      username: '',
      password: '',
      pullSecret: ''
    }
  };

  updateFormState = (field: string, value: string) =>
    this.setState(prevState => ({
      ...prevState,
      form: { ...prevState.form, [field]: value }
    }));

  handleClusterNameChange = (value: string) => {
    this.updateFormState('clusterName', value);
  };
  handleDNSDomainChange = (value: string) => {
    this.updateFormState('DNSDomain', value);
  };
  handleUsernameChange = (value: string) => {
    this.updateFormState('username', value);
  };
  handlePasswordChange = (value: string) => {
    this.updateFormState('password', value);
  };
  handlePullSecretChange = (value: string) => {
    this.updateFormState('pullSecret', value);
  };

  render(): JSX.Element {
    const {
      providePullSecret,
      form: { clusterName, DNSDomain, username, password, pullSecret }
    } = this.state;
    return (
      <PageSection variant={PageSectionVariants.light} isMain>
        <Grid gutter="md">
          <GridItem span={12} md={10} lg={6}>
            <TextContent>
              <Text component="h1">Define Cluster</Text>
            </TextContent>
            <Form>
              <FormGroup
                label="Cluster name"
                fieldId="create-cluster-cluster-name"
                helperText="Please provide cluster name"
                isRequired
              >
                <TextInput
                  type="text"
                  id="create-cluster-cluster-name"
                  name="clusterName"
                  aria-describedby="create-cluster-cluster-name-helper"
                  value={clusterName}
                  onChange={this.handleClusterNameChange}
                  isRequired
                />
              </FormGroup>
              <FormGroup
                label="Base DNS domain"
                fieldId="create-cluster-base-dns-domain"
                isRequired
              >
                <TextInput
                  type="text"
                  id="create-cluster-base-dns-domain"
                  name="DNSDomain"
                  aria-describedby="create-cluster-base-dns-domain-helper"
                  value={DNSDomain}
                  onChange={this.handleDNSDomainChange}
                  isRequired
                />
              </FormGroup>
              <TextContent>
                <Text component="h2">Connect to Red Hat Account </Text>
              </TextContent>
              {providePullSecret ? (
                <PullSecretFields
                  onProvideCredentials={() =>
                    this.setState({ providePullSecret: false })
                  }
                  handlePullSecretChange={this.handlePullSecretChange}
                  pullSecret={pullSecret}
                />
              ) : (
                <RedHatAccountFields
                  onProvidePullSecret={() =>
                    this.setState({ providePullSecret: true })
                  }
                  handleUsernameChange={this.handleUsernameChange}
                  handlePasswordChange={this.handlePasswordChange}
                  username={username}
                  password={password}
                />
              )}
            </Form>
          </GridItem>
        </Grid>
      </PageSection>
    );
  }
}
export default CreateClusterForm;
