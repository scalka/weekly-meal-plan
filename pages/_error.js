import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Layout from 'components/layout';

function Error({ statusCode = 500, statusMessage = '' }) {
  const router = useRouter();
  const user = useUser();
  const isLoggedIn = !!user;

  useEffect(() => {
    if (statusCode === 401) {
      router.push('/');
    }
  }, [statusCode]);

  return (
    <Layout isLoggedIn={isLoggedIn}>
      <p className="text-3xl pb-8">
        {`An error occurred. Try to log out and log in again.`}
      </p>
    </Layout>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = err?.status || res?.statusCode;
  const statusMessage = err?.message;
  return { statusCode, statusMessage };
};

export default Error;
