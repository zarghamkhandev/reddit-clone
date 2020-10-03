import { Box, Button, Flex, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {}

const NavBar: React.FunctionComponent<NavBarProps> = ({}) => {
  const { data, loading } = useMeQuery();
  let body = null;
  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link ml={4}>Register</Link>
        </NextLink>
      </>
    );
  } else if (data.me) {
    body = (
      <>
        <Box>{data.me.username}</Box>
        <Button variant="link" ml={4}>
          Logout
        </Button>
      </>
    );
  }
  return (
    <Flex bg="tan" p={4} justify={'flex-end'}>
      {body}
    </Flex>
  );
};

export default NavBar;
