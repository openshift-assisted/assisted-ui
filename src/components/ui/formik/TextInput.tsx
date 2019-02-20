import React, { Component, FormEvent } from 'react';
import { FieldProps } from 'formik';
import { FormGroup, TextInput as PFTextInput } from '@patternfly/react-core';

interface Props extends FieldProps {
  id: string;
  label: string;
  type?: string;
  helperText?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInline?: boolean;
  isReadOnly?: boolean;
}

export default class TextInput extends Component<Props> {
  // PFTextInput introduces different onChange footprint, this fixes it
  handleChange = (v: string, e: FormEvent<HTMLInputElement>): void =>
    this.props.field.onChange(e);

  render(): JSX.Element {
    const {
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
    }: Props = this.props;

    const isValid =
      !touched[field.name] || (!!touched[field.name] && !errors[field.name]);

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
          onChange={this.handleChange}
          {...rest}
        />
      </FormGroup>
    );
  }
}
