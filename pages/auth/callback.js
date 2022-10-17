export default function AuthCallback() {
  return (
    <main className="static p-5">
      <h1>Authorization</h1>
    </main>
  );
}

export async function getServerSideProps({ query: { code } }) {
  if (code) {
    try {
      const response = await fetch(`https://api.notion.com/v1/oauth/token`, {
        method: 'POST',
        headers: new Headers({
          Authorization:
            'Basic ' +
            btoa(
              process.env.NOTION_OAUTH_CLIENT_ID +
                ':' +
                process.env.NOTION_OAUTH_CLIENT_SECRET
            ),
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'http://localhost:3000/auth/callback/',
        }),
      });

      const res = await response.json();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  return {
    props: {}, // will be passed to the page component as props
  };
}
