import React from 'react';
import NavBar from './NavBar';

interface LayoutProps {}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default Layout;
