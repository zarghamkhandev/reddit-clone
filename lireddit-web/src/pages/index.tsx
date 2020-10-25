import { Box, Button, Heading, IconButton, Stack, Text } from '@chakra-ui/core';
import { onError } from 'apollo-link-error';
import { route } from 'next/dist/next-server/server/router';

import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import {
  PostDocument,
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
  useVoteMutation,
} from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const indexPage = () => {
  const { data: meData } = useMeQuery();
  const router = useRouter();
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { limit: 15, cursor: null as null | string },
    notifyOnNetworkStatusChange: true,
  });
  const [deletePost] = useDeletePostMutation({
    onError: () => {
      console.log('this post is not from you');
    },
  });
  const [vote, { data: voteResponse }] = useVoteMutation();
  return (
    <>
      <Layout>
        <Wrapper variant="regular">
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
                  <Box ml="4" display="flex" flexGrow={1}>
                    <Box>
                      <NextLink href={`/post/[id]`} as={`/post/${item.id}`}>
                        <Heading fontSize="xl" as="a" cursor="pointer">
                          {item.title}
                        </Heading>
                      </NextLink>
                      <Text>Posted by: {item.creator?.username}</Text>
                      <Text mt={4}>{item.text.slice(0, 50)}</Text>
                    </Box>
                    {meData?.me?.id !== item.creatorId.toString() ? null : (
                      <Box ml="auto" display="flex" flexDirection="column">
                        <IconButton
                          mb={2}
                          icon="delete"
                          aria-label="Delete Post"
                          isLoading={loading}
                          onClick={() => {
                            deletePost({
                              variables: { id: item.id },
                              update: (cache) => {
                                cache.evict({ id: `Post:${item.id}` });
                              },
                            });
                          }}
                        />
                        <IconButton
                          icon="edit"
                          aria-label="Edit Post"
                          isLoading={loading}
                          onClick={() => {
                            router.push(`/post/edit/${item.id}`);
                          }}
                        />
                      </Box>
                    )}
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
