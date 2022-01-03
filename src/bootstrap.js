import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';

import { store } from './store';

const dynamicFederation = async (scope, module) => {
  const container = window[scope]; // or get the container somewhere else
  // Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__.default);
  return container.get(module).then((factory) => {
    const Module = factory();
    console.log('Module', Module);
    return Module;
  });
};

const RemoteApp = React.lazy(() => dynamicFederation('app2', './RemoteApp'));

const Inner = () => {
  const state = useSelector((state) => state);
  return (
    <div>
      Welcome to Host App
      state: {JSON.stringify(state)}

      <button onClick={() => store.dispatch({ type: 'counter/increment' })}>
        Increment
      </button>
    </div>
  );
}
const App = () => {
  return (
    <Provider store={store}>
      <div>
        <Inner />  
        <div>
          <Suspense fallback="Loading...">
            <RemoteApp store={store} />
          </Suspense>
        </div>
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
