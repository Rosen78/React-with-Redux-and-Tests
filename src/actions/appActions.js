/**
 * Created by Rosen_Nikolov on 12/22/2016.
 */

import * as constants from '../constants/actionTypes/appActionTypes';

export const addCategory = (categoryName) => {
    return {
        type: constants.ADD_CATEGORY,
        newCategory: {
            ID: Date.now(),
            deleted: [{stateIndex: 0, info: true}, {stateIndex: -1, info: false}],
            name: [{stateIndex: 0, info: categoryName}],
            nestLevel: 0,
            subCategories: [],
            opened: [{stateIndex: 0, info: false}],
            selected: [{stateIndex: 0, info: false}],
            items: []
        }
    };
};

export const addItem = (itemName) => {
    return {
        type: constants.ADD_ITEM,
        newItem: {
            ID: Date.now(),
            deleted: [{stateIndex: 0, info: true}, {stateIndex: -1, info: false}],
            oldCategoryID: [{stateIndex: 0, info: -1}],
            oldPositionFromEnd: [{stateIndex: 0, info: -1}],
            name: [{stateIndex: 0, info: itemName}],
            done: [{stateIndex:  0, info: false}],
            description: [{stateIndex:  0, info: ''}]
        }
    };
};

export const undo = () => {
    return {
        type: constants.UNDO
    };
};

export const redo = () => {
    return {
        type: constants.REDO
    };
};
