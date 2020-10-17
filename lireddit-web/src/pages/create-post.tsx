import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import { PostsDocument, useCreatePostMutation } from '../generated/graphql';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FunctionComponent<{}> = ({}) => {
  const [createPost] = useCreatePostMutation();
  const router = useRouter();
  useIsAuth();
  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          initialValues={{ title: '', text: '' }}
          onSubmit={async (values) => {
            await createPost({
              variables: { title: values.title, text: values.text },
              update: (cache) => {
                cache.evict({ fieldName: 'posts' });
              },
            });

            router.push('/');
          }}>
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="title"
                label="Title"
                placeholder="Title here"
                type="text"
              />
              <Box mt={4}>
                <InputField
                  name="text"
                  label="Body"
                  placeholder="text..."
                  type="text"
                  textarea={true}
                />
              </Box>

              <Button
                type="submit"
                variantColor="teal"
                mt={4}
                isLoading={isSubmitting}>
                Create post
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default CreatePost;
