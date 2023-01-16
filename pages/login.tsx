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

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'notion',
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
