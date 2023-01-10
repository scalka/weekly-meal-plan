import Landing from 'components/Landing';
import Layout from 'components/layout';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function Home({ isLoggedIn }) {
  return (
    <Layout isLoggedIn={isLoggedIn}>
      <Landing isLoggedIn={isLoggedIn} />
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

  return {
    props: {
      isLoggedIn: true,
    },
  };
};
