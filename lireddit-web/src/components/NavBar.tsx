import { Flex, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';

interface NavBarProps {}

const NavBar: React.FunctionComponent<NavBarProps> = ({}) => {
  return (
    <Flex bg="tomato" p={4} justify={'flex-end'}>
      <NextLink href="/login">
        <Link>Login</Link>
      </NextLink>
      <NextLink href="/register">
        <Link ml={4}>Register</Link>
      </NextLink>
    </Flex>
  );
};

export default NavBar;
