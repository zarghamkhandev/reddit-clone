import { Box, Button, PseudoBox } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation, MeDocument } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';

// interface ChangePasswordProps {}

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [tokenError, setTokenError] = useState('');
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              token: token,
              newPassword: values.newPassword,
            },
            refetchQueries: [{ query: MeDocument }],
          });
          const errors: any = response.data?.changePassword.errors;
          if (errors) {
            const errorMap = toErrorMap(errors);
            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push('/');
          }
        }}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              label="New Password"
              placeholder="new password here"
              type="password"
            />
            {tokenError ? (
              <Box>
                <Box style={{ color: 'red' }}>{tokenError}</Box>
                <Box>
                  <Link href="/forgot-password">
                    <PseudoBox
                      as="a"
                      fontSize="sm"
                      _hover={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}>
                      Get new link here
                    </PseudoBox>
                  </Link>
                </Box>
              </Box>
            ) : null}
            <Button
              type="submit"
              variantColor="teal"
              mt={4}
              isLoading={isSubmitting}>
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default ChangePassword;
