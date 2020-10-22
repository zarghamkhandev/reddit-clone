import { Box, Button, Heading, IconButton, Stack, Text } from '@chakra-ui/core';

import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import {
  PostDocument,
  usePostsQuery,
  useVoteMutation,
} from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const indexPage = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { limit: 15, cursor: null as null | string },
    notifyOnNetworkStatusChange: true,
  });

  const [vote, { data: voteResponse }] = useVoteMutation();
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
                <Box
                  p={5}
                  key={item.id}
                  shadow="md"
                  borderWidth="1px"
                  display="flex">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center">
                    <IconButton
                      variant="solid"
                      fontSize="20px"
                      aria-label="upvote up"
                      icon="chevron-up"
                      variantColor={item.voteStatus === 1 ? 'green' : undefined}
                      onClick={() => {
                        console.log(voteResponse);
                        vote({
                          variables: { postId: item.id, value: 1 },
                          refetchQueries: [
                            {
                              query: PostDocument,
                              variables: { postId: item.id },
                            },
                          ],
                        });
                      }}
                    />
                    <Text my="2"> {item.points}</Text>

                    <IconButton
                      variant="solid"
                      fontSize="20px"
                      aria-label="upvote down"
                      variantColor={item.voteStatus === -1 ? 'red' : undefined}
                      icon="chevron-down"
                      onClick={() => {
                        vote({
                          variables: { postId: item.id, value: -1 },
                          refetchQueries: [
                            {
                              query: PostDocument,
                              variables: { postId: item.id },
                            },
                          ],
                        });
                      }}
                    />
                  </Box>
                  <Box ml="4">
                    <Heading fontSize="xl">{item.title}</Heading>
                    <Text>Posted by: {item.creator?.username}</Text>
                    <Text mt={4}>{item.text.slice(0, 50)}</Text>
                  </Box>
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

export default withApollo({ ssr: true })(indexPage);
