import { createStore, compose, applyMiddleware  } from 'redux';
import rootReducer from '../reducers';

export let persistor = undefined;

export default function configureStore(initialState, thunk, persistStore, REHYDRATE, createActionBuffer) {
    const store = createStore(rootReducer, initialState, compose(
        applyMiddleware(thunk, createActionBuffer(REHYDRATE))
        )
    );
    persistor = persistStore(store, {whitelist: ['currentUser']});

    return store;
}
