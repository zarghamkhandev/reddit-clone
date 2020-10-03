import { Box } from '@chakra-ui/core';
import React from 'react';

interface WrapperProps {
  variant?: 'small' | 'regular';
}

const Wrapper: React.FunctionComponent<WrapperProps> = ({
  children,
  variant = 'regular',
}) => {
  return (
    <Box
      w="100%"
      maxW={variant === 'regular' ? '800px' : '400px'}
      mt={8}
      mx="auto">
      {children}
    </Box>
  );
};

export default Wrapper;
