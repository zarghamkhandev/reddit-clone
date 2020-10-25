import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import Wrapper from '../../../components/Wrapper';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { withApollo } from '../../../utils/withApollo';

const EditPost = ({}) => {
  const id = useGetIntId();
  const { data, loading } = usePostQuery({
    skip: id === -1,
    variables: {
      postId: id,
    },
  });
  const [updatePost] = useUpdatePostMutation();
  const router = useRouter();
  if (loading) {
    return (
      <Layout>
        <div>Loading</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <div>Could not find post</div>
      </Layout>
    );
  }
  return (
    <Layout>
      <Wrapper variant="regular">
        <Formik
          initialValues={{ title: data.post.title, text: data?.post.text }}
          onSubmit={async ({ title, text }) => {
            // await createPost({
            //   variables: { title: values.title, text: values.text },
            //   update: (cache) => {
            //     cache.evict({ fieldName: 'posts' });
            //   },
            // });
            // router.push('/');

            await updatePost({ variables: { id, title, text } });
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
                Update Post
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
