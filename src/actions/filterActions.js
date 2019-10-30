/**
 * Created by Rosen_Nikolov on 12/29/2016.
 */

import * as constants from '../constants/actionTypes/filterActionTypes';

export const filterItems = (status, text) => {
    return {
        type: constants.FILTER_ITEMS,
        status,
        text
    };
};