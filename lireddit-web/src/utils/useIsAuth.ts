import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useIsAuth = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !data?.me) {
      console.log(data?.me);
      router.replace('/login?next=' + router.route);
    } else {
      console.log(data?.me);
    }
  }, [loading, data, router]);
};
