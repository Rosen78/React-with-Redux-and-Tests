/**
 * Created by Rosen_Nikolov on 12/22/2016.
 */

import * as constants from '../constants/actionTypes/categoriesTreeActionTypes';

export const categoryClicked = (categoryId) => {
    return {
        type: constants.CATEGORY_CLICKED,
        categoryId
    };
};

export const editCategory = (categoryId, categoryNewName) => {
    return {
        type: constants.EDIT_CATEGORY,
        categoryId,
        categoryNewName
    };
};

export const addSubCategory = (categoryId, subCategoryName) => {
    return {
        type: constants.ADD_SUB_CATEGORY,
        categoryId,
        subCategoryName
    };
};

export const deleteCategory = (categoryId, willSelectedCategoryBeDeleted) => {
    return {
        type: constants.DELETE_CATEGORY,
        categoryId,
        willSelectedCategoryBeDeleted
    };
};

export const moveItem = (editedItemId, categoryId) => {
    return {
        type: constants.MOVE_ITEM,
        editedItemId,
        categoryId
    };
};

export const categoryOpened = (categoryId) => {
    return {
        type: constants.CATEGORY_OPENED,
        categoryId
    };
};

