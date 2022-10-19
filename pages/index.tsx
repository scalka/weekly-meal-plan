import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import Landing from 'components/Landing';

export default function Home({ isLoggedIn, name = 'Not logged in' }) {
  return <Landing isLoggedIn={isLoggedIn} name={name} />;
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx, supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const isLoggedIn = !!user;

    return { props: { name: user?.user_metadata?.name, isLoggedIn } };
  },
});
