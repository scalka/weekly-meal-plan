import { withPageAuth } from '@supabase/auth-helpers-nextjs';

export default function Home({ name = 'Not logged in' }) {
  return <main>{name}</main>;
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx, supabase) {
    const {
      data,
      data: { user },
    } = await supabase.auth.getUser();

    return { props: { name: user?.user_metadata?.name } };
  },
});
