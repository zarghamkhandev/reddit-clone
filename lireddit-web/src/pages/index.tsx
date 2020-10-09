import React from 'react';
import NavBar from '../components/NavBar';
import { usePostsQuery } from '../generated/graphql';

const indexPage = () => {
  const { data } = usePostsQuery();

  return (
    <>
      <NavBar />
      {!data
        ? null
        : data?.posts?.map((item) => <div key={item.id}>{item.title}</div>)}
    </>
  );
};

export default indexPage;
