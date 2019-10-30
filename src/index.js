
import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore';
//import { syncHistoryWithStore } from 'react-router-redux';
//import thunk from 'redux-thunk';
import 'es6-promise';
//import {persistStore} from 'redux-persist';
//import {REHYDRATE} from 'redux-persist/constants';
//import createActionBuffer from 'redux-action-buffer';

//require('./favicon.ico'); // Tell webpack to load favicon.ico

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const store = configureStore({});

// Create an enhanced history that syncs navigation events with the store
//const history = syncHistoryWithStore(browserHistory, store);
const history = browserHistory;

render(
    <Provider store={store}>
        <Router history={history} routes={routes} />
    </Provider>, document.getElementById('root')
);
