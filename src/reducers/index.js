/**
 * Created by Rosen_Nikolov on 12/2/2016.
 */
import {combineReducers} from 'redux';
//import {routerReducer} from 'react-router-redux';
//import undoable from 'redux-undo-immutable';
import categoriesInfo from './appReducer';

const rootReducer = combineReducers({
   /* routing: routerReducer,*/
    categoriesInfo /*: undoable(categoriesInfo)*/
});

export default rootReducer;