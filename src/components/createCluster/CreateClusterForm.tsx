import React, { Component, Fragment } from 'react';
import {
  Formik,
  FormikActions,
  Field,
  validateYupSchema,
  yupToFormErrors
} from 'formik';
import {
  Form,
  Grid,
  GridItem,
  PageSectionVariants,
  TextContent,
  Text
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import ClusterWizardToolbar from '../ClusterWizardToolbar';
import RedHatAccountFields from './RedHatAccountFields';
import PageSection from '../ui/PageSection';
import PullSecretFields from './PullSecretFields';
import { WizardStep } from '../../models/wizard';
import { ToolbarButton, ToolbarText } from '../ui/Toolbar';
import { TextInput } from '../ui/formik';
import validationSchema from './validationSchema';
import { ClusterDefinition } from '../../models/clusterDefinition';
import { postInstallConfig } from '../../api/clusterDefinition';

interface Props {
  setCurrentStep: (step: WizardStep) => void;
}

export interface CreateClusterFormState {
  providePullSecret: boolean;
}

class CreateClusterForm extends Component<Props, CreateClusterFormState> {
  state: CreateClusterFormState = {
    providePullSecret: false
  };

  initialValues: ClusterDefinition = {
    clusterName: '',
    DNSDomain: '',
    pullSecret: '',
    username: '',
    password: ''
  };

  validate = (values: ClusterDefinition) => {
    // NOTE(jtomasek): This allows passing context to Yup schema
    // https://github.com/jaredpalmer/formik/issues/506#issuecomment-372229014
    try {
      validateYupSchema<ClusterDefinition>(values, validationSchema, true, {
        providePullSecret: this.state.providePullSecret
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  handleSubmit = (
    values: ClusterDefinition,
    formikActions: FormikActions<ClusterDefinition>
  ) => {
    postInstallConfig(values)
      .then(response => {
        // TODO(jtomasek): dispatch a success action
        console.log(response); // eslint-disable-line
        this.props.setCurrentStep(WizardStep.AddHosts);
        formikActions.setSubmitting(false);
      })
      .catch(e => {
        console.log(e); // eslint-disable-line
        formikActions.setStatus({ error: e.message });
        formikActions.setSubmitting(false);
        // TODO(jtomasek): dispatch a failure action
      });
  };

  render(): JSX.Element {
    const { providePullSecret } = this.state;
    return (
      <Formik
        initialValues={this.initialValues}
        initialStatus={{ error: null }}
        validate={this.validate}
        onSubmit={this.handleSubmit}
      >
        {({
          handleSubmit,
          isSubmitting,
          isValid,
          submitForm,
          validateForm,
          values,
          status
        }) => (
          <Fragment>
            <PageSection variant={PageSectionVariants.light} isMain>
              <Grid gutter="md">
                <GridItem span={12} lg={10} xl={6}>
                  <TextContent>
                    <Text component="h1">Define Cluster</Text>
                  </TextContent>
                  <Form className="pf-c-form" onSubmit={handleSubmit}>
                    <Field
                      component={TextInput}
                      label="Cluster name"
                      name="clusterName"
                      id="create-cluster-cluster-name"
                      helperText="This can not be changed after cluster is deployed"
                      isRequired
                    />
                    <Field
                      component={TextInput}
                      label="Base DNS domain"
                      name="DNSDomain"
                      id="create-cluster-base-dns-domain"
                      isRequired
                    />
                    <TextContent>
                      <Text component="h2">Connect to Red Hat Account </Text>
                    </TextContent>
                    {providePullSecret ? (
                      <PullSecretFields
                        onProvideCredentials={() => {
                          this.setState({ providePullSecret: false }, () =>
                            validateForm(values)
                          );
                        }}
                      />
                    ) : (
                      <RedHatAccountFields
                        onProvidePullSecret={() => {
                          this.setState({ providePullSecret: true }, () =>
                            validateForm(values)
                          );
                        }}
                      />
                    )}
                  </Form>
                </GridItem>
              </Grid>
            </PageSection>
            <ClusterWizardToolbar>
              <ToolbarButton
                variant="primary"
                onClick={submitForm}
                isDisabled={isSubmitting || !isValid}
              >
                Next
              </ToolbarButton>
              {isSubmitting && (
                <ToolbarText>Form is being submitted</ToolbarText>
              )}
              {status.error && (
                <ToolbarText>
                  <ExclamationCircleIcon /> {status.error}
                </ToolbarText>
              )}
            </ClusterWizardToolbar>
          </Fragment>
        )}
      </Formik>
    );
  }
}
export default CreateClusterForm;
