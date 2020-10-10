import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/core';
import { useField } from 'formik';
import React from 'react';

interface InputFieldProps {
  name: string;
  placeholder: string;
  label: string;
  type?: string;
  textarea?: boolean;
}

const InputField: React.FunctionComponent<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);
  let C = Input;
  if (props.textarea) {
    C = Textarea;
  }
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <C
        id={field.name}
        placeholder={props.placeholder}
        {...field}
        type={props.type}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
