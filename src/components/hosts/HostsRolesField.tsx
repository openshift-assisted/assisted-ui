import React from 'react';
import { useField, useFormikContext } from 'formik';
import { Alert, AlertVariant } from '@patternfly/react-core';
import { ClusterUpdateParams } from '../../api/types';
import { HostRole } from '../../config/constants';

type HostsRolesFieldContextType = {
  value: NonNullable<ClusterUpdateParams['hostsRoles']>;
  setValue: (hostId: string, role: HostRole) => void;
};

export const HostsRolesFieldContext = React.createContext<HostsRolesFieldContextType>({
  value: [],
  setValue: () => null,
});

const validateHostsRoles = (value: NonNullable<ClusterUpdateParams['hostsRoles']>) => {
  const masters = value.filter((r) => r.role === 'master');
  if (masters.length < 3) {
    return 'Add at least 3 masters';
  }
};

const HostsRolesField: React.FC = ({ children }) => {
  const [field, meta, helpers] = useField<NonNullable<ClusterUpdateParams['hostsRoles']>>({
    name: 'hostsRoles',
    validate: validateHostsRoles,
  });
  const { submitForm } = useFormikContext();

  const setRole = async (hostId: string, role: HostRole) => {
    const newValue = (field?.value).map((r) => {
      if (r.id === hostId) {
        return { ...r, role: role };
      }
      return r;
    });
    await helpers.setValue(newValue);
    submitForm();
  };

  return (
    <HostsRolesFieldContext.Provider value={{ setValue: setRole, value: field.value }}>
      {children}
      <br />
      {meta.error && (
        <Alert variant={AlertVariant.danger} title="Validation failed" isInline>
          {meta.error}
        </Alert>
      )}
    </HostsRolesFieldContext.Provider>
  );
};

export default HostsRolesField;
