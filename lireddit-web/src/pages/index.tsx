import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import { usePostsQuery } from '../generated/graphql';

const indexPage = () => {
  const { data } = usePostsQuery();

  return (
    <>
      <Layout>
        <Link href="/create-post">
          <a>Create Post</a>
        </Link>
        {!data
          ? null
          : data?.posts?.map((item) => <div key={item.id}>{item.title}</div>)}
      </Layout>
    </>
  );
};

export default indexPage;
