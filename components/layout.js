import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import Image from 'next/image';

export default function Layout({ isLoggedIn, children }) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  return (
    <>
      <nav className="w-full flex p-4">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <a
            href="https://flowbite.com/"
            className="flex items-center"
            aria-label="Back to home"
          >
            <Image src="/icons/fruit.svg" height={45} width={45} alt="" />
          </a>
        </div>
        {isLoggedIn && (
          <Button
            onClick={async () => {
              await supabaseClient.auth.signOut();
              router.push('/');
            }}
            variation="secondary"
            size="small"
          >
            Logout
          </Button>
        )}
      </nav>

      <main>{children}</main>
    </>
  );
}
