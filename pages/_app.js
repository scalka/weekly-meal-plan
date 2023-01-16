import { useReducer, useState, useEffect } from 'react';

// docs: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import Router from 'next/router';
import Context from 'state/Context';
import RootReducer from 'state/RootReducer';
import DEFAULT_STATE from 'state/defaultState';
import NProgress from 'nprogress';
import Loader from 'components/Loader';

import 'styles/all.css';

function App({ Component, pageProps }) {
  const [state, dispatch] = useReducer(RootReducer, DEFAULT_STATE);
  const store = { state, dispatch };
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on('routeChangeStart', (url) => {
      setIsLoading(true);
      NProgress.start();
    });
    Router.events.on('routeChangeComplete', (url) => {
      setIsLoading(false);
      NProgress.done(false);
    });
    Router.events.on('routeChangeError', (url) => {
      setIsLoading(false);
    });
  }, []);

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Context.Provider value={store}>
        {isLoading && <Loader />}
        <Component {...pageProps} />
      </Context.Provider>
    </SessionContextProvider>
  );
}

export default App;
