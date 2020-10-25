import { Box, Heading } from '@chakra-ui/core';
import React from 'react';
import Layout from '../../components/Layout';
import Wrapper from '../../components/Wrapper';
import { usePostQuery } from '../../generated/graphql';
import { useGetIntId } from '../../utils/useGetIntId';
import { withApollo } from '../../utils/withApollo';

const Post = ({}) => {
  const id = useGetIntId();
  const { data, loading } = usePostQuery({
    skip: id === -1,
    variables: {
      postId: id,
    },
  });
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
      <Wrapper>
        <Heading>{data.post.title}</Heading>
        <Box mt={4}>{data?.post.text}</Box>
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
