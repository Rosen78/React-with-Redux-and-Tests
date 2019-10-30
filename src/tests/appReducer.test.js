/**
 * Created by Rosen_Nikolov on 1/9/2017.
 */

import appReducer from './../reducers/appReducer'
import * as appActions from '../actions/appActions';
import * as categoriesTreeActions from '../actions/categoriesTreeActions';
import * as editedItemActions from '../actions/editedItemActions';
import * as filterActions from '../actions/filterActions';
import * as itemsListActions from '../actions/itemsListActions';
import initialState from './../reducers/InitialState';
//import jsdom from 'jsdom';

//let config = {url: 'http://localhost:3000/', done: () => {}};
//jsdom.env(config);

function deepCopy(o) {
    var copy = o,k;

    if (o && typeof o === 'object') {
        copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
        for (k in o) {
            copy[k] = deepCopy(o[k]);
        }
    }

    return copy;
}

describe('appReducer', () => {

    let state = Object.freeze(initialState.categoriesInfo);

    beforeEach(() => {
        state = deepCopy(Object.freeze(initialState.categoriesInfo));
    });

    it('appActions addCategory undo redo', () => {

        const categoryName = 'category name';

        let newState = appReducer(state, appActions.addCategory(categoryName));

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        expect(newState.categoriesAndItems.length).toBe(4);

        const newCategory = newState.categoriesAndItems[0];

        expect(typeof newCategory.ID).toBe('number');

        expect(newCategory.deleted[0].stateIndex).toBe(0);
        expect(newCategory.deleted[0].info).toBe(true);
        expect(newCategory.deleted[1].stateIndex).toBe(1);
        expect(newCategory.deleted[1].info).toBe(false);

        expect(newCategory.name[0].stateIndex).toBe(0);
        expect(newCategory.name[0].info).toBe(categoryName);

        expect(newCategory.nestLevel).toBe(0);

        expect(typeof newCategory.subCategories).toBe('object');
        expect(newCategory.subCategories.length).toBe(0);

        expect(newCategory.opened[0].stateIndex).toBe(0);
        expect(newCategory.opened[0].info).toBe(false);

        expect(newCategory.selected[0].stateIndex).toBe(0);
        expect(newCategory.selected[0].info).toBe(false);

        expect(typeof newCategory.items).toBe('object');
        expect(newCategory.items.length).toBe(0);

        appReducer.__Rewire__('setURI2', () => {});

        newState = appReducer(newState, appActions.undo());
        expect(newState.currentStateIndex).toBe(0);

        newState = appReducer(newState, appActions.undo());
        expect(newState.currentStateIndex).toBe(0);

        newState = appReducer(newState, appActions.redo());
        expect(newState.currentStateIndex).toBe(1);

        newState = appReducer(newState, appActions.redo());
        expect(newState.currentStateIndex).toBe(1);
    });

    it('appActions addItem', () => {
        const itemName = 'item name';

        const newState = appReducer(state, appActions.addItem(itemName));

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        expect(newState.categoriesAndItems[2].items.length).toBe(6);

        const newItem = newState.categoriesAndItems[2].items[0];

        expect(typeof newItem.ID).toBe('number');

        expect(newItem.deleted[0].stateIndex).toBe(0);
        expect(newItem.deleted[0].info).toBe(true);
        expect(newItem.deleted[1].stateIndex).toBe(1);
        expect(newItem.deleted[1].info).toBe(false);

        expect(newItem.oldCategoryID[0].stateIndex).toBe(0);
        expect(newItem.oldCategoryID[0].info).toBe(3);

        expect(newItem.oldPositionFromEnd[0].stateIndex).toBe(0);
        expect(newItem.oldPositionFromEnd[0].info).toBe(5);

        expect(newItem.name[0].stateIndex).toBe(0);
        expect(newItem.name[0].info).toBe(itemName);

        expect(newItem.done[0].stateIndex).toBe(0);
        expect(newItem.done[0].info).toBe(false);

        expect(newItem.description[0].stateIndex).toBe(0);
        expect(newItem.description[0].info).toBe('');
    });

    it('categoriesTreeActions categoryClicked', () => {
        const categoryId = 1;

        const newState = appReducer(state, categoriesTreeActions.categoryClicked(categoryId));

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        expect(newState.categoriesAndItems[2].selected[1].info).toBe(false);
        expect(newState.categoriesAndItems[0].selected[1].info).toBe(true);
        expect(newState.categoriesAndItems[2].selected[1].stateIndex).toBe(1);
        expect(newState.categoriesAndItems[0].selected[1].stateIndex).toBe(1);
    });

    it('categoriesTreeActions addSubCategory', () => {
        const categoryId = 1;
        const subCategoryName = 'subcategory name';

        const newState = appReducer(state, categoriesTreeActions.addSubCategory(categoryId, subCategoryName));

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        expect(newState.categoriesAndItems[0].subCategories.length).toBe(1);

        const newSubCategory = newState.categoriesAndItems[0].subCategories[0];

        expect(typeof newSubCategory.ID).toBe('number');

        expect(newSubCategory.deleted[0].stateIndex).toBe(0);
        expect(newSubCategory.deleted[0].info).toBe(true);
        expect(newSubCategory.deleted[1].stateIndex).toBe(1);
        expect(newSubCategory.deleted[1].info).toBe(false);

        expect(newSubCategory.name[0].stateIndex).toBe(0);
        expect(newSubCategory.name[0].info).toBe(subCategoryName);

        expect(newSubCategory.nestLevel).toBe(1);

        expect(typeof newSubCategory.subCategories).toBe('object');
        expect(newSubCategory.subCategories.length).toBe(0);

        expect(newSubCategory.opened[0].stateIndex).toBe(0);
        expect(newSubCategory.opened[0].info).toBe(false);

        expect(newSubCategory.selected[0].stateIndex).toBe(0);
        expect(newSubCategory.selected[0].info).toBe(false);

        expect(typeof newSubCategory.items).toBe('object');
        expect(newSubCategory.items.length).toBe(0);
    });

    it('categoriesTreeActions categoryOpened', () => {
        const categoryId = 1;

        const newState = appReducer(state, categoriesTreeActions.categoryOpened(categoryId));

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        expect(newState.categoriesAndItems[0].opened[1].info).toBe(true);
        expect(newState.categoriesAndItems[0].opened[1].stateIndex).toBe(1);
    });

    it('categoriesTreeActions deleteCategory', () => {
        let categoryId = 1;

        let newState = appReducer(state, categoriesTreeActions.deleteCategory(categoryId, false));

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        expect(newState.categoriesAndItems[0].deleted[1].info).toBe(true);
        expect(newState.categoriesAndItems[0].deleted[1].stateIndex).toBe(1);

        categoryId = 3;
        newState = appReducer(newState, categoriesTreeActions.deleteCategory(categoryId, true));

        expect(newState.currentStateIndex).toBe(2);
        expect(newState.lastStateIndex).toBe(2);

        expect(newState.categoriesAndItems[2].deleted[1].info).toBe(true);
        expect(newState.categoriesAndItems[2].subCategories[0].deleted[1].info).toBe(true);
        expect(newState.categoriesAndItems[2].subCategories[1].deleted[1].info).toBe(true);
        expect(newState.categoriesAndItems[2].subCategories[2].deleted[1].info).toBe(true);
        expect(newState.categoriesAndItems[2].deleted[1].stateIndex).toBe(2);
        expect(newState.categoriesAndItems[2].subCategories[0].deleted[1].stateIndex).toBe(2);
        expect(newState.categoriesAndItems[2].subCategories[1].deleted[1].stateIndex).toBe(2);
        expect(newState.categoriesAndItems[2].subCategories[2].deleted[1].stateIndex).toBe(2);
    });

    it('categoriesTreeActions editCategory', () => {
        const categoryId = 1;
        const categoryNewName = 'category new name';

        const newState = appReducer(state, categoriesTreeActions.editCategory(categoryId, categoryNewName));

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        expect(newState.categoriesAndItems[0].name[1].info).toBe(categoryNewName);
        expect(newState.categoriesAndItems[0].name[1].stateIndex).toBe(1);
    });

    it('categoriesTreeActions moveItem', () => {
        const categoryId = 1;
        const editedItemId = 1;

        const newState = appReducer(state, categoriesTreeActions.moveItem(editedItemId, categoryId));

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        expect(newState.categoriesAndItems[2].items.length).toBe(4);
        expect(newState.categoriesAndItems[0].items.length).toBe(1);
        expect(newState.categoriesAndItems[0].items[0].ID).toBe(1);
    });

    it('editedItemActions cancel', () => {
        const categoryId = 1;
        const editedItemId = 1;

        const newState = appReducer(state, editedItemActions.cancel());

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        expect(newState.editedItemId[1].info).toBe(undefined);
        expect(newState.editedItemId[1].stateIndex).toBe(1);

        expect(newState.mode[1].info).toBe('selectedCategory');
        expect(newState.mode[1].stateIndex).toBe(1);
    });

    it('editedItemActions saveChanges', () => {
        const itemId = 1;
        const itemName = 'new item name';
        const itemStatus = true;
        const itemDescription = 'new item description';

        const newState = appReducer(state, editedItemActions.saveChanges(itemId, itemName, itemStatus, itemDescription));

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        const item = newState.categoriesAndItems[2].items[0];

        expect(item.name[1].info).toBe(itemName);
        expect(item.name[1].stateIndex).toBe(1);

        expect(item.done[1].info).toBe(itemStatus);
        expect(item.done[1].stateIndex).toBe(1);

        expect(item.description[1].info).toBe(itemDescription);
        expect(item.description[1].stateIndex).toBe(1);

        expect(newState.editedItemId[1].info).toBe(undefined);
        expect(newState.editedItemId[1].stateIndex).toBe(1);

        expect(newState.mode[1].info).toBe('selectedCategory');
        expect(newState.mode[1].stateIndex).toBe(1);
    });

    it('filterActions filterItems', () => {
        const statusFilter = true;
        const textFilter = 'a';

        const newState = appReducer(state, filterActions.filterItems(statusFilter, textFilter));

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        expect(newState.itemsFilter.status[1].info).toBe(statusFilter);
        expect(newState.itemsFilter.status[1].stateIndex).toBe(1);

        expect(newState.itemsFilter.text[1].info).toBe(textFilter);
        expect(newState.itemsFilter.text[1].stateIndex).toBe(1);
    });

    it('itemsListActions setItemStatus', () => {
        const itemId = 1;

        const newState = appReducer(state, itemsListActions.setItemStatus(itemId));

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        const item = newState.categoriesAndItems[2].items[0];

        expect(item.done[1].info).toBe(true);
        expect(item.done[1].stateIndex).toBe(1);
    });

    it('itemsListActions editItem', () => {
        const itemId = 1;

        const newState = appReducer(state, itemsListActions.editItem(itemId));

        expect(newState.currentStateIndex).toBe(1);
        expect(newState.lastStateIndex).toBe(1);

        expect(newState.editedItemId[1].info).toBe(itemId);
        expect(newState.editedItemId[1].stateIndex).toBe(1);

        expect(newState.mode[1].info).toBe('selectedItem');
        expect(newState.mode[1].stateIndex).toBe(1);
    });

});

