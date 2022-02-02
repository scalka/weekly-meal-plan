import { useReducer } from 'react';
import Context from 'state/Context';
import RootReducer from 'state/RootReducer';
import DEFAULT_STATE from 'state/defaultState';

import 'styles/all.css';

function App({ Component, pageProps }) {
  const [state, dispatch] = useReducer(RootReducer, DEFAULT_STATE);
  const store = { state, dispatch };

  return (
    <Context.Provider value={store}>
      <Component {...pageProps} />
    </Context.Provider>
  );
}

export default App;
