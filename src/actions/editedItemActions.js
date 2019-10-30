/**
 * Created by Rosen_Nikolov on 12/30/2016.
 */

import * as constants from '../constants/actionTypes/editedItemActionTypes';

export const cancel = () => {
    return {
        type: constants.CANCEL
    };
};

export const saveChanges = (itemId, itemName, itemStatus, itemDescription) => {
    return {
        type: constants.SAVE_CHANGES,
        itemToSave: {
            ID: itemId,
            name: itemName,
            done: itemStatus,
            description: itemDescription
        }
    };
};