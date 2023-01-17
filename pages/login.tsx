import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../lib/initSupabase';
import Landing from 'components/Landing';
import Layout from 'components/layout';

const LoginPage = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only redirect once user is logged in.
    if (user) {
      router.push('/planner');
    }
  }, [user]);

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/';
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url;
  };

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'notion',
        options: {
          redirectTo: getURL(),
        },
      });
      if (error) throw error;
    } catch (error) {
      console.log(error.error_description || error.message);
    }
  };

  return (
    <Layout isLoggedIn={false}>
      <Landing handleLogin={handleLogin} />
    </Layout>
  );
};

export default LoginPage;
