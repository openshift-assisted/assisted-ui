import React from 'react';
import { Formik, FormikHelpers, Field, validateYupSchema, yupToFormErrors } from 'formik';
import {
  Form,
  Grid,
  GridItem,
  PageSectionVariants,
  TextContent,
  Text,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import ClusterWizardToolbar from '../ClusterWizardToolbar';
import RedHatAccountFields from './RedHatAccountFields';
import PageSection from '../ui/PageSection';
import PullSecretFields from './PullSecretFields';
import { WizardStep } from '../../types/wizard';
import { ToolbarButton, ToolbarText } from '../ui/Toolbar';
import { TextInput } from '../ui/formik';
import validationSchema from './validationSchema';
import { ClusterDefinition } from '../../types/clusterDefinition';
import { postInstallConfig } from '../../api/clusterDefinition';

interface CreateClusterFormProps {
  setCurrentStep: (step: WizardStep) => void;
}

export interface CreateClusterFormState {
  providePullSecret: boolean;
}

const CreateClusterForm: React.FC<CreateClusterFormProps> = ({ setCurrentStep }) => {
  const [providePullSecret, setProvidePullSecret] = React.useState(false);

  const initialValues: ClusterDefinition = {
    clusterName: '',
    DNSDomain: '',
    pullSecret: '',
    username: '',
    password: '',
  };

  const validate = (values: ClusterDefinition) => {
    // NOTE(jtomasek): This allows passing context to Yup schema
    // https://github.com/jaredpalmer/formik/issues/506#issuecomment-372229014
    try {
      validateYupSchema<ClusterDefinition>(values, validationSchema, true, {
        providePullSecret,
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  const handleSubmit = (
    values: ClusterDefinition,
    formikActions: FormikHelpers<ClusterDefinition>,
  ) => {
    postInstallConfig(values)
      .then((response) => {
        // TODO(jtomasek): dispatch a success action
        console.log(response); // eslint-disable-line
        setCurrentStep(WizardStep.AddHosts);
        formikActions.setSubmitting(false);
      })
      .catch((e) => {
        console.log(e); // eslint-disable-line
        formikActions.setStatus({ error: e.message });
        formikActions.setSubmitting(false);
        // TODO(jtomasek): dispatch a failure action
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      initialStatus={{ error: null }}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, isSubmitting, isValid, submitForm, status }) => (
        <>
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
                    <PullSecretFields onProvideCredentials={() => setProvidePullSecret(false)} />
                  ) : (
                    <RedHatAccountFields onProvidePullSecret={() => setProvidePullSecret(true)} />
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
            {isSubmitting && <ToolbarText>Form is being submitted</ToolbarText>}
            {status.error && (
              <ToolbarText>
                <ExclamationCircleIcon /> {status.error}
              </ToolbarText>
            )}
          </ClusterWizardToolbar>
        </>
      )}
    </Formik>
  );
};

export default CreateClusterForm;
