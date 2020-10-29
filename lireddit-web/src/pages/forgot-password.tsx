import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

interface ForgotPasswordProps {}

const ForgotPassword: React.FunctionComponent<ForgotPasswordProps> = ({}) => {
  const [forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          const response = await forgotPassword({
            variables: {
              email: values.email,
            },
          });
          setComplete(true);
        }}>
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              If an account with this email exists, we have sent you an email
            </Box>
          ) : (
            <Form>
              <InputField name="email" label="Email" placeholder="Email here" />
              <Button
                type="submit"
                variantColor="teal"
                mt={4}
                isLoading={isSubmitting}>
                Forgot Password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
