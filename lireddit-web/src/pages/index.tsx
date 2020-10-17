import { Box, Button, Heading, Stack, Text } from '@chakra-ui/core';
import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import { usePostsQuery } from '../generated/graphql';

const indexPage = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { limit: 15, cursor: null as null | string },
    notifyOnNetworkStatusChange: true,
  });

  return (
    <>
      <Layout>
        <Wrapper variant="regular">
          <Box display="flex">
            <Heading>LiReddit</Heading>
            <Box ml="auto">
              <Link href="/create-post">
                <a>Create Post</a>
              </Link>
            </Box>
          </Box>
          {!data && loading ? (
            <div>Loading...</div>
          ) : (
            <Stack>
              {data?.posts?.posts?.map((item) => (
                <Box p={5} key={item.id} shadow="md" borderWidth="1px">
                  <Heading fontSize="xl">{item.title}</Heading>
                  <Text mt={4}>{item.text.slice(0, 50)}</Text>
                </Box>
              ))}
            </Stack>
          )}
          <Box display="flex" justifyContent="center">
            <Button
              my={4}
              bg="tan"
              isDisabled={!data?.posts.hasMore}
              isLoading={loading}
              onClick={() => {
                fetchMore({
                  variables: {
                    limit: variables?.limit,
                    cursor: data?.posts?.posts?.slice(-1)[0].createdAt,
                  },
                });
              }}>
              Load More
            </Button>
          </Box>
        </Wrapper>
      </Layout>
    </>
  );
};

export default indexPage;
