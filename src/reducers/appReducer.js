/**
 * Created by Rosen_Nikolov on 12/22/2016.
 */

import initialState from './InitialState';
import * as categoriesTreeConstants from '../constants/actionTypes/categoriesTreeActionTypes';
import * as appConstants from '../constants/actionTypes/appActionTypes';
import * as itemsListConstants from '../constants/actionTypes/itemsListActionTypes';
import * as filterConstants from '../constants/actionTypes/filterActionTypes';
import * as editedItemConstants from '../constants/actionTypes/editedItemActionTypes';
import {traverseCategories} from '../helpers/helpers';
//import {LOCATION_CHANGE} from 'react-router-redux'
import {FILTER_STATUS_ALL, FILTER_STATUS_ONLY_DONE, NO_FILTER_TEXT, NO_CATEGORY, NO_EDITED_ITEM} from '../constants/additionalConstants'
import {browserHistory} from 'react-router';
import {findNewPath, getPropertyValue, setURI2} from '../helpers/helpers';

const addPropertyState = (propertyArray, stateIndex, info) => {
    propertyArray.push({stateIndex: stateIndex, info: info});
}

const removeCurrentlySelectedCategory = (categoriesAndItems, copiedState, categoryId) => {
    const removeCurrentlySelectedCategoryInner = (categoryInfo) => {
        if(categoryInfo.ID !== categoryId) {
            if (getPropertyValue(categoryInfo.selected, copiedState.currentStateIndex) === true) {
                addPropertyState(categoryInfo.selected, copiedState.currentStateIndex, false);
                return true;
            }
        }

        return false;
    }

    return traverseCategories(null, categoriesAndItems, removeCurrentlySelectedCategoryInner, null);
}

const setNewSelectedCategory = (copiedState, categoriesAndItems, categoryId) => {
    const setNewSelectedCategoryInner = (categoryInfo, resultObject, inputObject) => {
        addPropertyState(categoryInfo.selected,  copiedState.currentStateIndex, true);

        return true;
    }

    return traverseCategories(categoryId, categoriesAndItems, setNewSelectedCategoryInner);
}

const categoryClicked = (copiedState, categoryId, noChangeInOpenState = false) => {
    copiedState.categoriesAndItems = removeCurrentlySelectedCategory(copiedState.categoriesAndItems, copiedState, categoryId);
    copiedState.categoriesAndItems = setNewSelectedCategory(copiedState, copiedState.categoriesAndItems, categoryId, noChangeInOpenState);

    addPropertyState(copiedState.noCategorySelected,  copiedState.currentStateIndex, false);

    return copiedState;
}

const categoryOpened = (copiedState, categoryId) => {
    const categoryOpenedInner = (categoryInfo, resultObject, inputObject) => {
        const openedValue = getPropertyValue(categoryInfo.opened, copiedState.currentStateIndex);
        addPropertyState(categoryInfo.opened,  copiedState.currentStateIndex, !openedValue);

        return true;
    }

    copiedState.categoriesAndItems = traverseCategories(categoryId, copiedState.categoriesAndItems, categoryOpenedInner);

    return copiedState;
}

const categoryAdded = (copiedState, newCategory) => {
    newCategory.deleted[1].stateIndex = copiedState.currentStateIndex;

    copiedState.categoriesAndItems.unshift(newCategory);

    return copiedState;
}

const categoryEdited = (copiedState, categoryId, newCategoryName) => {
    const categoryEditedInner = (categoryInfo, resultObject, inputObject) => {
        addPropertyState(categoryInfo.name,  copiedState.currentStateIndex, inputObject.newCategoryName);
        return true;
    }

    const inputObject = {};
    inputObject.newCategoryName = newCategoryName;

    copiedState.categoriesAndItems =
        traverseCategories(categoryId, copiedState.categoriesAndItems, categoryEditedInner, null, inputObject);

    return copiedState;
}

const subCategoryAdded = (copiedState, categoryId, subCategoryName) => {
    const subCategoryAddedInner = (categoryInfo, resultObject, inputObject) => {
        const newSubCategory = {
            ID: Date.now(),
            deleted: [{stateIndex: 0, info: true}, {stateIndex: -1, info: false}],
            name: [{stateIndex: 0, info: inputObject.subCategoryName}],
            nestLevel: categoryInfo.nestLevel + 1,
            subCategories: [],
            opened: [{stateIndex: 0, info: false}],
            selected: [{stateIndex: 0, info: false}],
            items: []
        }

        newSubCategory.deleted[1].stateIndex = copiedState.currentStateIndex;

        categoryInfo.subCategories.unshift(newSubCategory);

        return true;
    }

    const inputObject = {};
    inputObject.subCategoryName = subCategoryName;

    copiedState.categoriesAndItems =
        traverseCategories(categoryId, copiedState.categoriesAndItems, subCategoryAddedInner, null, inputObject);

    return copiedState;
}

const categoryDeleted = (copiedState, categoryId, willSelectedCategoryBeDeleted) => {
    const categoryDeletedInner = (categoryInfo, resultObject, inputObject, categoriesAndItems, index) => {
        const categoryDeletedInnerInner = (categoryInfo) => {
            addPropertyState(categoryInfo.deleted, copiedState.currentStateIndex, true);

            return false;
        }

        if(categoryInfo.ID === categoryId) {
            addPropertyState(categoryInfo.deleted, copiedState.currentStateIndex, true);

            //Set deleted state for the subcategories as well
            traverseCategories(null, categoryInfo.subCategories, categoryDeletedInnerInner);
        }

        if(willSelectedCategoryBeDeleted == true) {
            if (getPropertyValue(categoryInfo.selected, copiedState.currentStateIndex) === true) {
                addPropertyState(categoryInfo.selected, copiedState.currentStateIndex, false);
            }
        }

        //Possible optimisation - to return true when all the if conditions from above are entered, if possible
        // to be entered for the certain case.
        return false;
    }

    copiedState.categoriesAndItems =
        traverseCategories(null, copiedState.categoriesAndItems, categoryDeletedInner, null, null);

    if(willSelectedCategoryBeDeleted == true) {
        addPropertyState(copiedState.noCategorySelected,  copiedState.currentStateIndex, true);
    }

    return copiedState;
}

const itemAdded = (copiedState, newItem) => {
    const itemAddedInner = (categoryInfo, resultObject, inputObject) => {
        if(getPropertyValue(categoryInfo.selected, copiedState.currentStateIndex) === true) {
            inputObject.newItem.oldCategoryID[0].info = categoryInfo.ID;
            inputObject.newItem.oldPositionFromEnd[0].info = categoryInfo.items.length;
            inputObject.newItem.deleted[1].stateIndex = copiedState.currentStateIndex;

            categoryInfo.items.unshift(inputObject.newItem);

            resultObject.addItemError = '';

            return true;
        }

        return false;
    }

    if(newItem.name[0].info === '') {
        addPropertyState(copiedState.addItemError,  copiedState.currentStateIndex, 'An item name should be entered.');

        return copiedState;
    }

    const isNoCategorySelected = getPropertyValue(copiedState.noCategorySelected, copiedState.currentStateIndex);
    if(isNoCategorySelected === true) {
        addPropertyState(copiedState.addItemError,  copiedState.currentStateIndex, 'A category should be selected.');

        return copiedState;
    }

    const inputObject = {};
    inputObject.newItem = newItem;

    const resultObject = {addItemError: ''};

    copiedState.categoriesAndItems =
        traverseCategories(null, copiedState.categoriesAndItems, itemAddedInner, resultObject, inputObject);

    addPropertyState(copiedState.addItemError,  copiedState.currentStateIndex, resultObject.addItemError);

    return copiedState;
}

const itemStatusSet = (copiedState, itemId) => {
    const itemStatusSetInner = (categoryInfo, resultObject, inputObject) => {
        if(getPropertyValue(categoryInfo.selected, copiedState.currentStateIndex) === true) {
            for(let i = 0; i < categoryInfo.items.length; i++) {
                let item = categoryInfo.items[i];
                if(item.ID == inputObject.itemId) {
                    const itemDoneValue = getPropertyValue(item.done, copiedState.currentStateIndex);
                    addPropertyState(item.done,  copiedState.currentStateIndex, !itemDoneValue);
                    break;
                }
            }

            return true;
        }

        return false;
    }

    const inputObject = {};
    inputObject.itemId = itemId;

    copiedState.categoriesAndItems =
        traverseCategories(null, copiedState.categoriesAndItems, itemStatusSetInner, null, inputObject);

    return copiedState;
}

//    This function is not used at the moment.
//    For usage of back and forward browser button. But will not work for cases like deleted categories.
// Erased past information is not saved to return to it later.
const locationChanged = (copiedState, locationInfo) => {
    const path = decodeURI(locationInfo.pathname);
    const splitPath = path.split('/');

    const categoryId = Number(splitPath[1].substring(splitPath[1].indexOf('--') + 2));
    let filterStatus = splitPath[2].substring(splitPath[2].indexOf('--') + 2);
    let filterText = splitPath[3].substring(splitPath[3].indexOf('--') + 2);
    const itemId = Number(splitPath[4].substring(splitPath[4].indexOf('--') + 2));

    if(!isNaN(categoryId)) {
        copiedState = categoryClicked(copiedState, categoryId, true);
    } else {
        copiedState.categoriesAndItems = removeCurrentlySelectedCategory(copiedState.categoriesAndItems, copiedState);
    }

    if(filterStatus === FILTER_STATUS_ALL) {
        filterStatus = false;
    } else {
        filterStatus = true;
    }
    if(filterText === NO_FILTER_TEXT) {
        filterText = '';
    }
    const itemsFilter = {
        status: filterStatus,
        text: filterText
    }
    copiedState.itemsFilter = itemsFilter;

    if(!isNaN(itemId)) {
        copiedState.mode = 'selectedItem';
        copiedState.editedItemId = itemId;
    } else {
        copiedState.mode = 'selectedCategory';
        copiedState.editedItemId = undefined;
    }

    return copiedState;
}

const itemSaved = (copiedState, itemToSave) => {
    const itemSavedInner = (categoryInfo, resultObject, inputObject) => {
        // It is not possible to optimize here to search only in the selected category - it is not always the case now
        for (let i = 0; i < categoryInfo.items.length; i++) {
            const item = categoryInfo.items[i];
            if (item.ID === inputObject.itemToSave.ID) {
                addPropertyState(item.name,  copiedState.currentStateIndex, inputObject.itemToSave.name);
                addPropertyState(item.done,  copiedState.currentStateIndex, inputObject.itemToSave.done);
                addPropertyState(item.description,  copiedState.currentStateIndex, inputObject.itemToSave.description);

                return true;
            }
        }

        return false;
    }

    const inputObject = {};
    inputObject.itemToSave = itemToSave;

    copiedState.categoriesAndItems =
        traverseCategories(null, copiedState.categoriesAndItems, itemSavedInner, null, inputObject);

    addPropertyState(copiedState.editedItemId,  copiedState.currentStateIndex, undefined);
    addPropertyState(copiedState.mode,  copiedState.currentStateIndex, 'selectedCategory');

    return copiedState;
}

const removeItemToMove = (copiedState,  editedItemId, itemToMove) => {
    const removeItemToMoveInner = (categoryInfo, resultObject, inputObject) => {
        // It is not possible to optimize here to search only in the selected category - it is not always the case now
        for (let i = 0; i < categoryInfo.items.length; i++) {
            const item = categoryInfo.items[i];
            if (item.ID === inputObject.editedItemId) {
                resultObject.itemToMove = item;

                categoryInfo.items.splice(i, 1);

                return true;
            }
        }

        return false;
    }

    const resultObject = {};

    const inputObject = {};
    inputObject.editedItemId = editedItemId;

    copiedState.categoriesAndItems =
        traverseCategories(null, copiedState.categoriesAndItems, removeItemToMoveInner, resultObject, inputObject);

    itemToMove.item = resultObject.itemToMove;

    return copiedState;
}

const setItemToMove = (copiedState, itemToMove, categoryId, isAddPropertyStates = true) => {
    const setItemToMoveInner = (categoryInfo, resultObject, inputObject) => {
        if(isAddPropertyStates === true) {
            addPropertyState(inputObject.itemToMove.oldCategoryID, copiedState.currentStateIndex, categoryInfo.ID);
            addPropertyState(inputObject.itemToMove.oldPositionFromEnd, copiedState.currentStateIndex, categoryInfo.items.length);
            categoryInfo.items.unshift(inputObject.itemToMove);
        } else {
            const oldPositionFromEnd = getPropertyValue(inputObject.itemToMove.oldPositionFromEnd, copiedState.currentStateIndex);
            let position = categoryInfo.items.length - oldPositionFromEnd;
            if(position < 0) {
                position = 0;
            }
            categoryInfo.items.splice(position, 0, inputObject.itemToMove);
        }

        return true;
    }

    const inputObject = {};
    inputObject.itemToMove = itemToMove;

    copiedState.categoriesAndItems =
        traverseCategories(categoryId, copiedState.categoriesAndItems, setItemToMoveInner, null, inputObject);

    return copiedState;
}

const itemMoved = (copiedState, editedItemId, categoryId) => {
    let itemToMove = {};

    copiedState = removeItemToMove(copiedState, editedItemId, itemToMove);
    copiedState = setItemToMove(copiedState, itemToMove.item, categoryId);

    return copiedState;
}

// Not used function
const getCurrentStateIndex = (currentState, states) => {
    let currentStateIndex = -1;

    for (let i = 0; i < states.length; i++) {
        let isCurrentStateFound = true;
        const state = states[i];
        if (currentState.length === state.length) {
            for (let k = 0; k < state.length; k++) {
                if (state[k] !== currentState[k]) {
                    isCurrentStateFound = false;
                    break;
                }
            }
        } else {
            isCurrentStateFound = false;
        }

        if (isCurrentStateFound === true) {
            currentStateIndex = i;
            break;
        }
    }

    return currentStateIndex;
}

const itemEdited = (copiedState, inputInfoObject) => {
    addPropertyState(copiedState.mode,  copiedState.currentStateIndex, inputInfoObject.mode);
    addPropertyState(copiedState.editedItemId,  copiedState.currentStateIndex, inputInfoObject.editedItemId);

    return copiedState;
}

const changeCategoriesAndItems = (categoriesAndItems,  currentStateIndex, oldStateIndex) => {
    for(let i = 0; i < categoriesAndItems.length; i++) {
        let categoryAndItems = categoriesAndItems[i];
        addPropertyState(categoryAndItems.deleted,  currentStateIndex, getPropertyValue(categoryAndItems.deleted, oldStateIndex));
        addPropertyState(categoryAndItems.name,  currentStateIndex, getPropertyValue(categoryAndItems.name, oldStateIndex));
        addPropertyState(categoryAndItems.opened,  currentStateIndex, getPropertyValue(categoryAndItems.opened, oldStateIndex));
        addPropertyState(categoryAndItems.selected,  currentStateIndex, getPropertyValue(categoryAndItems.selected, oldStateIndex));

        let items = categoryAndItems.items;
        for(let k = 0; k < items.length; k++) {
            let item = items[k];
            addPropertyState(item.deleted,  currentStateIndex, getPropertyValue(item.deleted, oldStateIndex));
            addPropertyState(item.oldCategoryID,  currentStateIndex, getPropertyValue(item.oldCategoryID, oldStateIndex));
            addPropertyState(item.oldPositionFromEnd,  currentStateIndex, getPropertyValue(item.oldPositionFromEnd, oldStateIndex));
            addPropertyState(item.name,  currentStateIndex, getPropertyValue(item.name, oldStateIndex));
            addPropertyState(item.done,  currentStateIndex, getPropertyValue(item.done, oldStateIndex));
            addPropertyState(item.description,  currentStateIndex, getPropertyValue(item.description, oldStateIndex));
        }

        changeCategoriesAndItems(categoryAndItems.subCategories,  currentStateIndex, oldStateIndex);
    }
}

const changeStateIndexes = (copiedState, isEmptyAddItemError = true) => {
    const oldStateIndex = copiedState.currentStateIndex;

    copiedState.lastStateIndex++;
    copiedState.currentStateIndex = copiedState.lastStateIndex;

    if(isEmptyAddItemError === true) {
        const addItemErrorLastState = getPropertyValue(copiedState.addItemError, copiedState.currentStateIndex - 1);
        if (addItemErrorLastState !== '') {
            addPropertyState(copiedState.addItemError, copiedState.currentStateIndex, '');
        }
    }

    //   The way undo/redo is implemented, if going back with undo and starting to change a past state, the whole past state is copied as a new state in front of all
    //recorded states and the current state becomes this front state.
    if(oldStateIndex !== (copiedState.currentStateIndex - 1)) {
        addPropertyState(copiedState.mode,  copiedState.currentStateIndex, getPropertyValue(copiedState.mode, oldStateIndex));
        addPropertyState(copiedState.addItemError,  copiedState.currentStateIndex, getPropertyValue(copiedState.addItemError, oldStateIndex));
        addPropertyState(copiedState.itemsFilter.status,  copiedState.currentStateIndex, getPropertyValue(copiedState.itemsFilter.status, oldStateIndex));
        addPropertyState(copiedState.itemsFilter.text,  copiedState.currentStateIndex, getPropertyValue(copiedState.itemsFilter.text, oldStateIndex));
        addPropertyState(copiedState.editedItemId,  copiedState.currentStateIndex, getPropertyValue(copiedState.editedItemId, oldStateIndex));
        addPropertyState(copiedState.noCategorySelected,  copiedState.currentStateIndex, getPropertyValue(copiedState.noCategorySelected, oldStateIndex));

        let categoriesAndItems = copiedState.categoriesAndItems;
        changeCategoriesAndItems(categoriesAndItems,  copiedState.currentStateIndex, oldStateIndex);

        copiedState.lastStateIndex++;
        copiedState.currentStateIndex = copiedState.lastStateIndex;
    }

    return copiedState;
}

const itemCanceled = (copiedState, inputInfoObject) => {
    addPropertyState(copiedState.mode,  copiedState.currentStateIndex, inputInfoObject.mode);
    addPropertyState(copiedState.editedItemId,  copiedState.currentStateIndex, undefined);

    return copiedState;
}

const itemsFiltered = (copiedState, inputInfoObject) => {
    addPropertyState(copiedState.itemsFilter.status,  copiedState.currentStateIndex, inputInfoObject.itemsFilter.status);
    addPropertyState(copiedState.itemsFilter.text,  copiedState.currentStateIndex, inputInfoObject.itemsFilter.text);

    return copiedState;
}

const getSelectedCategoryName = (copiedState) => {
    const getSelectedCategoryNameInner = (categoryInfo, resultObject, inputObject) => {
        if(getPropertyValue(categoryInfo.selected, copiedState.currentStateIndex) === true) {
            resultObject.selectedCategoryName = getPropertyValue(categoryInfo.name, copiedState.currentStateIndex);

            return true;
        }

        return false;
    }

    const resultObject = {selectedCategoryName: undefined};

    traverseCategories(null, copiedState.categoriesAndItems, getSelectedCategoryNameInner, resultObject);

    return resultObject.selectedCategoryName;
}

const getSelectedItemName = (copiedState, editedItemId) => {
    const getSelectedItemNameInner = (categoryInfo, resultObject, inputObject) => {
        // It is not possible to optimize here to search only in the selected category - it is not always the case now
        for (let i = 0; i < categoryInfo.items.length; i++) {
            const item = categoryInfo.items[i];
            if (item.ID === inputObject.editedItemId) {
                resultObject.selectedItemName = getPropertyValue(item.name, copiedState.currentStateIndex);
                return true;
            }
        }

        return false;
    }

    const resultObject = {selectedItemName: undefined};

    const inputObject = {};
    inputObject.editedItemId = editedItemId;

    traverseCategories(null, copiedState.categoriesAndItems, getSelectedItemNameInner, resultObject, inputObject);

    return resultObject.selectedItemName;
}

const setTheURL = (copiedNewState) => {
    let selectedCategoryName = getSelectedCategoryName(copiedNewState);
    if(selectedCategoryName === undefined) {
        selectedCategoryName = NO_CATEGORY;
    }
    let filterStatus = getPropertyValue(copiedNewState.itemsFilter.status, copiedNewState.currentStateIndex);
    if(filterStatus === false) {
        filterStatus = FILTER_STATUS_ALL;
    } else {
        filterStatus = FILTER_STATUS_ONLY_DONE;
    }
    let filterText = getPropertyValue(copiedNewState.itemsFilter.text, copiedNewState.currentStateIndex);
    if(filterText === '') {
        filterText = NO_FILTER_TEXT;
    }
    let selectedItemName = getSelectedItemName(copiedNewState, getPropertyValue(copiedNewState.editedItemId, copiedNewState.currentStateIndex));
    if(selectedItemName === undefined) {
        selectedItemName = NO_EDITED_ITEM;
    }

    setURI2(selectedCategoryName, filterStatus, filterText, selectedItemName);
    //const newPath = findNewPath(selectedCategoryName, filterStatus, filterText, selectedItemName);
    //browserHistory.push(newPath);
}

const getItemsToMoveInfo = (copiedState, itemsToMoveInfo) => {
    const getItemsToMoveInfoInner = (categoryInfo, resultObject, inputObject) => {
        for (let i = 0; i < categoryInfo.items.length; i++) {
            const item = categoryInfo.items[i];

            //if item moved at least once
            if(item.oldCategoryID.length > 1) {
                const oldCategoryId = getPropertyValue(item.oldCategoryID, copiedState.currentStateIndex);
                if(oldCategoryId !== categoryInfo.ID) {
                    let itemToMoveInfo = {};
                    itemToMoveInfo.item = item;
                    itemToMoveInfo.oldCategoryId = oldCategoryId;

                    itemsToMoveInfo.push(itemToMoveInfo);

                    categoryInfo.items.splice(i, 1);
                }
            }
        }

        return false;
    }

    return traverseCategories(null, copiedState.categoriesAndItems, getItemsToMoveInfoInner);
}

const moveItems = (copiedState) => {
    let itemsToMoveInfo = [];

    copiedState.categoriesAndItems = getItemsToMoveInfo(copiedState, itemsToMoveInfo);

    //Can be optimized for performance
    for (let i = 0; i < itemsToMoveInfo.length; i++) {
        const itemToMoveInfo = itemsToMoveInfo[i];
        copiedState = setItemToMove(copiedState, itemToMoveInfo.item, itemToMoveInfo.oldCategoryId, false);
    }

    return copiedState;
}

export default function appReducer(state = initialState.categoriesInfo, action) {
    switch (action.type) {
        case appConstants.UNDO:
            let newStateUndo =  Object.assign({}, state, {currentStateIndex: state.currentStateIndex !== 0 ? (state.currentStateIndex - 1) : 0});
            newStateUndo = moveItems(newStateUndo);
            setTheURL(Object.assign({}, newStateUndo))
            return newStateUndo;
        case appConstants.REDO:
            let newStateRedo = Object.assign({}, state, {currentStateIndex: state.currentStateIndex !== state.lastStateIndex ? (state.currentStateIndex + 1) : state.lastStateIndex});
            newStateRedo = moveItems(newStateRedo);
            setTheURL(Object.assign({}, newStateRedo));
            return newStateRedo;
        case categoriesTreeConstants.CATEGORY_CLICKED:
            return Object.assign({}, state, categoryClicked(changeStateIndexes(Object.assign({}, state)), action.categoryId));
        case categoriesTreeConstants.CATEGORY_OPENED:
            return Object.assign({}, state, categoryOpened(changeStateIndexes(Object.assign({}, state)), action.categoryId));
        case appConstants.ADD_CATEGORY:
            return Object.assign({}, state, categoryAdded(changeStateIndexes(Object.assign({}, state)), action.newCategory));
        case categoriesTreeConstants.EDIT_CATEGORY:
            return Object.assign({}, state, categoryEdited(changeStateIndexes(Object.assign({}, state)), action.categoryId, action.categoryNewName));
        case categoriesTreeConstants.ADD_SUB_CATEGORY:
            return Object.assign({}, state, subCategoryAdded(changeStateIndexes(Object.assign({}, state)), action.categoryId, action.subCategoryName));
        case categoriesTreeConstants.DELETE_CATEGORY:
            return Object.assign({}, state, categoryDeleted(changeStateIndexes(Object.assign({}, state)), action.categoryId, action.willSelectedCategoryBeDeleted));
        case appConstants.ADD_ITEM:
            return Object.assign({}, state, itemAdded(changeStateIndexes(Object.assign({}, state), false), action.newItem));
        case itemsListConstants.SET_ITEM_STATUS:
            return Object.assign({}, state, itemStatusSet(changeStateIndexes(Object.assign({}, state)), action.itemId));
        case filterConstants.FILTER_ITEMS:
            return Object.assign({}, state, itemsFiltered(changeStateIndexes(Object.assign({}, state)), {itemsFilter : {status: action.status, text: action.text}}));
        case itemsListConstants.EDIT_ITEM:
            return Object.assign({}, state, itemEdited(changeStateIndexes(Object.assign({}, state)), {mode: 'selectedItem', editedItemId: action.itemId}));
        case editedItemConstants.CANCEL:
            return Object.assign({}, state, itemCanceled(changeStateIndexes(Object.assign({}, state)), {mode: 'selectedCategory'}));
        case editedItemConstants.SAVE_CHANGES:
            return Object.assign({}, state, itemSaved(changeStateIndexes(Object.assign({}, state)), action.itemToSave));
        case categoriesTreeConstants.MOVE_ITEM:
            return Object.assign({}, state, itemMoved(changeStateIndexes(Object.assign({}, state)), action.editedItemId, action.categoryId));
        default:
            return state;
    }
}

