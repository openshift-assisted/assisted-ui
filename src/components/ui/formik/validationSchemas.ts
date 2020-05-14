import * as Yup from 'yup';

export const CLUSTER_NAME_REGEX = /^([a-z]([-a-z0-9]*[a-z0-9])?)*$/;
export const SSH_PUBLIC_KEY_REGEX = /^ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@| |\t|\n]+)?$/;

export const nameValidationSchema = Yup.string()
  .matches(CLUSTER_NAME_REGEX, {
    message:
      'Name must consist of lower-case letters, numbers and hyphens. It must start with a letter and end with a letter or number.',
    excludeEmptyString: true,
  })
  .max(253, 'Cannot be longer than 253 characters.')
  .required('Required');

export const getUniqueNameValidationSchema = (excludedList: (string | undefined)[]) =>
  Yup.mixed().test(
    'unique-name',
    'Name "${value}" is already taken.', // eslint-disable-line no-template-curly-in-string
    (value) => !excludedList.includes(value),
  );

export const sshPublicKeyValidationSchema = Yup.string()
  .matches(SSH_PUBLIC_KEY_REGEX, {
    message: 'SSH public key must consist of "ssh-rsa key [email]"',
    excludeEmptyString: true,
  })
  .required('Required');

export const validJSONSchema = Yup.string()
  .test('is-json', 'Value must be valid JSON.', (value) => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  })
  .required('Required');
