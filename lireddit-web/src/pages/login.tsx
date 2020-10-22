import React from 'react';
import { Form, Formik } from 'formik';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, Button, PseudoBox } from '@chakra-ui/core';
import { MeDocument, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { withApollo } from '../utils/withApollo';

interface loginProps {}

const login: React.FunctionComponent<loginProps> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: {
              usernameOrEmail: values.usernameOrEmail,
              password: values.password,
            },
            update: (cache) => {
              cache.evict({ fieldName: 'posts' });
            },
            refetchQueries: [{ query: MeDocument }],
            awaitRefetchQueries: true,
          });
          const errors: any = response.data?.login.errors;
          if (errors) {
            setErrors(toErrorMap(errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === 'string') {
              router.push(router.query.next);
            } else {
              router.push('/');
            }
          }
        }}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="Username or Email"
              placeholder="username or email here"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password here"
                type="password"
              />
            </Box>
            <Box display="flex">
              <Link href="/forgot-password">
                <PseudoBox
                  as="a"
                  ml="auto"
                  fontSize="sm"
                  _hover={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}>
                  Forgot Password ?
                </PseudoBox>
              </Link>
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

export default withApollo({ ssr: false })(login);
