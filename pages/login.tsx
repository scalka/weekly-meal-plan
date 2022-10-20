import { useRouter } from 'next/router';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from '../lib/initSupabase';
import Landing from 'components/Landing';

const LoginPage = () => {
  const { session, error } = useSessionContext();
  const router = useRouter();

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

  if (session) {
    router.push('/planner');
  }

  return (
    <div>
      {error && <p>{error.message}</p>}
      <Landing handleLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
