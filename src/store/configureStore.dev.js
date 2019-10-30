
import { createStore, compose, applyMiddleware  } from 'redux';
import rootReducer from '../reducers';

//export let persistor = undefined;

export default function configureStore(initialState/*, thunk, persistStore, REHYDRATE, createActionBuffer*/) {
    const store = createStore(rootReducer, initialState, compose(
        // Add other middleware on this line...
       // applyMiddleware(thunk, createActionBuffer(REHYDRATE)),
        window.devToolsExtension ? window.devToolsExtension() : f => f // add support for Redux dev tools
        )
    );
    //persistor = persistStore(store, {whitelist: ['currentUser', 'tempUser', 'admin', 'adminMessages']});

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers').default; // eslint-disable-line global-require
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
