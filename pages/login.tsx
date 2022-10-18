import { useRouter } from 'next/router';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from '../lib/initSupabase';

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
    <>
      {error && <p>{error.message}</p>}
      <div>
        <button onClick={handleLogin}>Sign in with Notion</button>
      </div>
    </>
  );
};

export default LoginPage;
