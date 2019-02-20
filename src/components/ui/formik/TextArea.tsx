import React, { Component, FormEvent } from 'react';
import { FieldProps } from 'formik';
import { FormGroup, TextArea as PFTextArea } from '@patternfly/react-core';

interface Props extends FieldProps {
  id: string;
  label: string;
  helperText?: string;
  isRequired?: boolean;
  isInline?: boolean;
}

export default class TextArea extends Component<Props> {
  // PFTextInput introduces different onChange footprint, this fixes it
  handleChange = (v: string, e: FormEvent<HTMLInputElement>): void =>
    this.props.field.onChange(e);

  render(): JSX.Element {
    const {
      field,
      form: { touched, errors },
      id,
      label,
      helperText,
      isRequired = false,
      isInline = false,
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
        <PFTextArea
          id={id}
          isValid={isValid}
          isRequired={isRequired}
          {...field}
          onChange={this.handleChange}
          {...rest}
        />
      </FormGroup>
    );
  }
}
