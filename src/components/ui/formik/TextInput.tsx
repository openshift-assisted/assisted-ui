import React, { FormEvent } from 'react';
import { FieldProps } from 'formik';
import { FormGroup, TextInput as PFTextInput } from '@patternfly/react-core';

interface TextInputProps extends FieldProps {
  id: string;
  label: string;
  type?: string;
  helperText?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInline?: boolean;
  isReadOnly?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  field,
  form: { touched, errors, isSubmitting },
  id,
  label,
  type = 'text',
  helperText,
  isRequired = false,
  isDisabled = false,
  isInline = false,
  isReadOnly = false,
  ...rest
}) => {
  // PFTextInput introduces different onChange footprint, this fixes it
  const handleChange = (v: string, e: FormEvent<HTMLInputElement>): void => field.onChange(e);

  const isValid = !touched[field.name] || (!!touched[field.name] && !errors[field.name]);

  return (
    <FormGroup
      label={label}
      fieldId={id}
      helperText={helperText}
      helperTextInvalid={errors[field.name]}
      isValid={isValid}
      isRequired={isRequired}
      isInline={isInline}
    >
      <PFTextInput
        type={type}
        id={id}
        isValid={isValid}
        isRequired={isRequired}
        isDisabled={isDisabled || isSubmitting}
        isReadOnly={isReadOnly}
        {...field}
        onChange={handleChange}
        {...rest}
      />
    </FormGroup>
  );
};

export default TextInput;
