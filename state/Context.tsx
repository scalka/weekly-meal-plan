import { createContext } from 'react';

import DEFAULT_STATE from 'state/defaultState';

const Context = createContext({
  state: DEFAULT_STATE,
  dispatch: (payload) => {},
});

export default Context;
