import React from 'react';
import {
  ButtonVariant,
  Button,
  Form,
  Alert,
  AlertVariant,
  AlertActionCloseButton,
  Modal,
  ModalBoxFooter,
} from '@patternfly/react-core';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';
import history from '../../history';
import { LoadingState } from '../ui/uiState';
import { postCluster } from '../../api/clusters';
import { Formik, FormikHelpers } from 'formik';
import { OPENSHIFT_VERSION_OPTIONS } from '../../config/constants';
import { ClusterCreateParams } from '../../api/types';
import { InputField, SelectField } from '../ui/formik';
import { handleApiError } from '../../api/utils';
import { ToolbarButton } from '../ui/Toolbar';

const namesConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  // dictionaries: [starWars],
  separator: '-',
  length: 3,
  style: 'lowerCase',
};

export const NewClusterModalButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <ToolbarButton variant={ButtonVariant.primary} onClick={() => setIsModalOpen(true)}>
        Create New Cluster
      </ToolbarButton>
      {isModalOpen && <NewClusterModal closeModal={closeModal} />}
    </>
  );
};

type NewClusterModalProps = {
  closeModal: () => void;
};

export const NewClusterModal: React.FC<NewClusterModalProps> = ({ closeModal }) => {
  const nameInputRef = React.useCallback((node) => {
    if (node !== null) {
      node.focus();
    }
  }, []);

  const handleSubmit = async (
    values: ClusterCreateParams,
    formikActions: FormikHelpers<ClusterCreateParams>,
  ) => {
    formikActions.setStatus({ error: null });
    try {
      const { data } = await postCluster(values);
      history.push(`/clusters/${data.id}`);
    } catch (e) {
      handleApiError<ClusterCreateParams>(e, () =>
        formikActions.setStatus({ error: 'Failed to create new cluster' }),
      );
    }
  };

  return (
    <Modal
      title="New Bare Metal OpenShift Cluster"
      isOpen={true}
      onClose={closeModal}
      isFooterLeftAligned
      isSmall
    >
      <Formik
        initialValues={{
          name: uniqueNamesGenerator(namesConfig),
          version: OPENSHIFT_VERSION_OPTIONS[0].value,
        }}
        initialStatus={{ error: null }}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting, isValid, status, setStatus }) => (
          <Form onSubmit={handleSubmit}>
            {status.error && (
              <Alert
                variant={AlertVariant.danger}
                title={status.error}
                action={<AlertActionCloseButton onClose={() => setStatus({ error: null })} />}
                isInline
              />
            )}
            {isSubmitting ? (
              <LoadingState />
            ) : (
              <>
                <InputField innerRef={nameInputRef} label="Cluster Name" name="name" isRequired />
                <SelectField
                  label="OpenShift Version"
                  name="openshiftVersion"
                  options={OPENSHIFT_VERSION_OPTIONS}
                  isRequired
                />
              </>
            )}
            <ModalBoxFooter isLeftAligned>
              <Button
                type="submit"
                variant={ButtonVariant.primary}
                isDisabled={isSubmitting || !isValid}
              >
                Continue
              </Button>{' '}
              <Button variant={ButtonVariant.secondary} onClick={closeModal}>
                Cancel
              </Button>
            </ModalBoxFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
