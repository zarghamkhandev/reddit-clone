import { FormControl, FormLabel, Input } from '@chakra-ui/core';
import { useField } from 'formik';
import React from 'react';

interface InputFieldProps {
  name: string;
  placeholder: string;
  label: string;
  type?: string;
}

const InputField: React.FunctionComponent<InputFieldProps> = (props) => {
  const [field] = useField(props);
  return (
    <FormControl>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input
        id={field.name}
        placeholder={props.placeholder}
        {...field}
        type={props.type}
      />
    </FormControl>
  );
};

export default InputField;
