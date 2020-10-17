import { gql } from '@apollo/client';
import { Box, Button, Heading, IconButton, Stack, Text } from '@chakra-ui/core';

import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import { usePostsQuery, useVoteMutation } from '../generated/graphql';

const indexPage = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { limit: 15, cursor: null as null | string },
    notifyOnNetworkStatusChange: true,
  });
  const [vote] = useVoteMutation();
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
                      onClick={() => {
                        vote({
                          variables: { postId: item.id, value: 1 },
                          update: (cache) => {
                            const readData = cache.readFragment({
                              id: `Post:${item.id}`,
                              fragment: gql`
                                fragment _ on Post {
                                  points
                                }
                              `,
                            }) as any;

                            if (readData) {
                              cache.writeFragment({
                                id: `Post:${item.id}`,
                                fragment: gql`
                                  fragment _ on Post {
                                    points
                                  }
                                `,
                                data: { points: 1 },
                              });
                            }
                          },
                        });
                      }}
                    />
                    <Text my="2"> {item.points}</Text>

                    <IconButton
                      variant="solid"
                      fontSize="20px"
                      aria-label="upvote down"
                      icon="chevron-down"
                      onClick={() => {
                        vote({
                          variables: { postId: item.id, value: -1 },
                          update: (cache) => {
                            const readData = cache.readFragment({
                              id: `Post:${item.id}`,
                              fragment: gql`
                                fragment _ on Post {
                                  points
                                }
                              `,
                            }) as any;

                            const oldPoints = readData.points;
                            if (oldPoints) {
                              cache.writeFragment({
                                id: `Post:${item.id}`,
                                fragment: gql`
                                  fragment _ on Post {
                                    points
                                  }
                                `,
                                data: { points: -1 },
                              });
                            }
                          },
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

export default indexPage;
