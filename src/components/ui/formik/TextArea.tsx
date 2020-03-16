import React, { FormEvent } from 'react';
import { FieldProps } from 'formik';
import { FormGroup, TextArea as PFTextArea } from '@patternfly/react-core';

interface TextAreaProps extends FieldProps {
  id: string;
  label: string;
  helperText?: string;
  isRequired?: boolean;
  isInline?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  field,
  form: { touched, errors },
  id,
  label,
  helperText,
  isRequired = false,
  isInline = false,
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
      <PFTextArea
        id={id}
        isValid={isValid}
        isRequired={isRequired}
        {...field}
        onChange={handleChange}
        {...rest}
      />
    </FormGroup>
  );
};

export default TextArea;
