import { Heading } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import Wrapper from '../../components/Wrapper';
import { usePostQuery } from '../../generated/graphql';
import { withApollo } from '../../utils/withApollo';

const Post = ({}) => {
  const router = useRouter();
  const id =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const { data, loading, error } = usePostQuery({
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
        <p>{data?.post.text}</p>
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
