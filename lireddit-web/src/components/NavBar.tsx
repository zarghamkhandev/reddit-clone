import { Box, Button, Flex, Heading, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';
import {
  MeDocument,
  useLogoutMutation,
  useMeQuery,
} from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

const NavBar: React.FunctionComponent<NavBarProps> = ({}) => {
  const { data, loading } = useMeQuery({ skip: isServer() });
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  let body = null;
  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr="2">login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
  } else if (data.me) {
    body = (
      <>
        <NextLink href="/create-post">
          <Button variant="solid" mr={'2'}>
            Create Post
          </Button>
        </NextLink>
        <Box>{data.me.username}</Box>
        <Button
          variant="link"
          ml={4}
          onClick={async () => {
            await logout({
              refetchQueries: [{ query: MeDocument }],
            });
          }}
          isLoading={logoutLoading}>
          Logout
        </Button>
      </>
    );
  }
  return (
    <Flex
      bg="tan"
      p={4}
      justify={'flex-end'}
      position="sticky"
      top="0"
      zIndex={10}>
      <NextLink href="/">
        <Heading cursor="pointer">LiReddit</Heading>
      </NextLink>
      <Box ml={'auto'} display="flex" alignItems="center">
        {body}
      </Box>
    </Flex>
  );
};

export default NavBar;
