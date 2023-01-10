import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Button from '../components/Button';

export default function Layout({ isLoggedIn, children }) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  return (
    <>
      {isLoggedIn && (
        <Button
          onClick={async () => {
            await supabaseClient.auth.signOut();
            router.push('/');
          }}
        >
          Logout
        </Button>
      )}
      <main>{children}</main>
    </>
  );
}
