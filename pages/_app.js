import { useReducer, useState } from 'react';

// docs: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

import Context from 'state/Context';
import RootReducer from 'state/RootReducer';
import DEFAULT_STATE from 'state/defaultState';

import 'styles/all.css';

function App({ Component, pageProps }) {
  const [state, dispatch] = useReducer(RootReducer, DEFAULT_STATE);
  const store = { state, dispatch };
  // todo: check if this is not duplicated by initSupabase.js
  // todo: extend token - check what happens if you don't use app for some time
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Context.Provider value={store}>
        <Component {...pageProps} />
      </Context.Provider>
    </SessionContextProvider>
  );
}

export default App;
