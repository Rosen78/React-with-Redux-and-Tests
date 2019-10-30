/**
 * Created by Rosen_Nikolov on 12/27/2016.
 */

import {browserHistory} from 'react-router';

export const getNewPath = (oldPath, category, filterStatus, filterText, toDoItem) => {
    const oldPathSplit = oldPath.split('/');

    const newCategory = category === null ? oldPathSplit[1] : 'Category--' +  encodeURI(category);
    const newFilterStatus = filterStatus === null ? oldPathSplit[2] : 'FilterStatus--' +  encodeURI(filterStatus);
    const newFilterText = filterText === null ? oldPathSplit[3] : 'FilterText--' +  encodeURI(filterText);
    const newToDoItem = toDoItem === null ? oldPathSplit[4] : 'ToDoItem--' +  encodeURI(toDoItem);

    let newPath = `/${newCategory}/${newFilterStatus}/${newFilterText}/${newToDoItem}`;

    return newPath;
}

export const findNewPath = (selectedCategoryName, filterStatus, filterText, selectedItemName) => {
    const newCategory = 'Category--' +  encodeURI(selectedCategoryName);
    const newFilterStatus = 'FilterStatus--' +  encodeURI(filterStatus);
    const newFilterText = 'FilterText--' +  encodeURI(filterText);
    const newToDoItem = 'ToDoItem--' +  encodeURI(selectedItemName);

    let newPath = `/${newCategory}/${newFilterStatus}/${newFilterText}/${newToDoItem}`;

    return newPath;
}

export const findSelectedItems = (categoriesAndItems) => {
    const findSelectedItemsInner = (categoryInfo, resultObject) => {
        if(categoryInfo.selected === true) {
            resultObject.selectedCategoryItems = categoryInfo.items;

            return true;
        }

        return false;
    }

    let selectedCategoryItemsWrapper = {selectedCategoryItems: undefined};
    traverseCategories(null, categoriesAndItems, findSelectedItemsInner, selectedCategoryItemsWrapper);

    return selectedCategoryItemsWrapper.selectedCategoryItems;
}

let isResultFulfilled = false;

export const traverseCategories = (categoryId, categoriesAndItems, functionOnCategory, resultObject, inputObject)=>  {
    isResultFulfilled = false;
    return traverseCategoriesInner(categoryId, categoriesAndItems, functionOnCategory, resultObject, inputObject);
}

const traverseCategoriesInner = (categoryId, categoriesAndItems, functionOnCategory, resultObject, inputObject) => {
    for(let i = 0; i < categoriesAndItems.length; i++) {
        const categoryInfo = categoriesAndItems[i];

        if(((categoryId !== null) && (categoryInfo.ID === categoryId)) || (categoryId === null)) {
            isResultFulfilled = functionOnCategory(categoryInfo, resultObject, inputObject, categoriesAndItems, i);
            if(isResultFulfilled === true) {
                break;
            }
        }

        if(categoryInfo.subCategories.length > 0) {
            traverseCategoriesInner(categoryId, categoryInfo.subCategories, functionOnCategory, resultObject, inputObject);
            if(isResultFulfilled === true) {
                break;
            }
        }
    }

    return categoriesAndItems;
}

export const getPropertyValue = (propertyArray, currentStateIndex) => {
    var minIndex = 0;
    var maxIndex = propertyArray.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
        currentIndex = Math.round((minIndex + maxIndex) / 2);
        currentIndex = currentIndex < 0 ? 0 : currentIndex;

        currentElement = propertyArray[currentIndex];

        if (currentElement.stateIndex < currentStateIndex) {
            minIndex = currentIndex + 1;
        } else if (currentElement.stateIndex > currentStateIndex) {
            maxIndex = currentIndex - 1;
        } else {
            return currentElement.info;
        }
    }

    if (currentElement.stateIndex < currentStateIndex) {
        return currentElement.info;
    } else {
        return propertyArray[currentIndex - 1].info;
    }
}

export const getCategoryNameAddition = (category) => {
    let categoryNameAddition = '';
    if(category.items.length === 0) {
        categoryNameAddition = ' (empty)';
    } else {
        let doneItemsCount = 0;
        for(let i = 0; i < category.items.length; i++) {
            if(category.items[i].done === true) {
                doneItemsCount++;
            }
        }
        if(doneItemsCount === category.items.length) {
            categoryNameAddition = ' (done)';
        }
    }

    return categoryNameAddition;
}

export const setURI = (category, filterStatus, filterText, toDoItem) => {
    const path = browserHistory.getCurrentLocation().pathname;
    const newPath = getNewPath(path, category, filterStatus, filterText, toDoItem);
    browserHistory.push(newPath);
}

export const setURI2 = (categoryName, filterStatus, filterText, toDoItemName) => {
    const newPath = findNewPath(categoryName, filterStatus, filterText, toDoItemName);
    browserHistory.push(newPath);
}