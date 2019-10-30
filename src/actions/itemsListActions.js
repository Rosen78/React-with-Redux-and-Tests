/**
 * Created by Rosen_Nikolov on 12/28/2016.
 */

import * as constants from '../constants/actionTypes/itemsListActionTypes';

export const setItemStatus = (itemId) => {
    return {
        type: constants.SET_ITEM_STATUS,
        itemId
    };
};

export const editItem = (itemId) => {
    return {
        type: constants.EDIT_ITEM,
        itemId
    };
};