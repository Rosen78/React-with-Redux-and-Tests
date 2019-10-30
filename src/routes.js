/**
 * Created by Rosen_Nikolov on 12/2/2016.
 */
import React from 'react';
import {Route} from 'react-router';

import App from './elements/App';
import AppWrapper from './elements/AppWrapper';
//import NotFoundPage from './NotFoundPage';

export default (
    <Route path="/" component={AppWrapper} history={history} >
        <Route path="/:category/:filterStatus/:filterText/:todoItem" component={App}></Route>
    </Route>
);