import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, Button } from '@chakra-ui/core';
import { MeDocument, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withApollo } from '../utils/withApollo';

interface registerProps {}

const register: React.FunctionComponent<registerProps> = ({}) => {
  const router = useRouter();

  const [register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: {
              username: values.username,
              password: values.password,
              email: values.email,
            },
            refetchQueries: [{ query: MeDocument }],
          });
          const errors: any = response.data?.register.errors;
          if (errors) {
            setErrors(toErrorMap(errors));
          } else if (response.data?.register.user) {
            router.push('/');
          }
        }}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="username here"
            />
            <Box mt={4}>
              <InputField
                name="email"
                label="Email"
                placeholder="Email here"
                type="email"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password here"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              variantColor="teal"
              mt={4}
              isLoading={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(register);
