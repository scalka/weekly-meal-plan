import Link from 'next/link';

export default function Home() {
  return (
    <main className="static p-5">
      <Link href="https://api.notion.com/v1/oauth/authorize?client_id=1d966069-7282-496c-85d2-2c651bf05493&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback%2F">
        Authorize Notion
      </Link>
    </main>
  );
}
