import * as Yup from 'yup';

export const CLUSTER_NAME_REGEX = /^([a-z]([-a-z0-9]*[a-z0-9])?)*$/;

export const nameValidationSchema = Yup.string()
  .matches(CLUSTER_NAME_REGEX, {
    message:
      'Name must consist of lower-case letters, numbers and hyphens. It must start with a letter and end with a letter or number.',
    excludeEmptyString: true,
  })
  .max(253, 'Cannot be longer than 253 characters.')
  .required('Required');
