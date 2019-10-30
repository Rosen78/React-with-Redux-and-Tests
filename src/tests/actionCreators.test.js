/**
 * Created by Rosen_Nikolov on 1/9/2017.
 */

import * as appActions from '../actions/appActions'
import * as appConstants from '../constants/actionTypes/appActionTypes';
import * as categoriesTreeActions from '../actions/categoriesTreeActions';
import * as categoriesTreeConstants from '../constants/actionTypes/categoriesTreeActionTypes';
import * as editedItemActions from '../actions/editedItemActions';
import * as editedItemConstants from '../constants/actionTypes/editedItemActionTypes';
import * as filterActions from '../actions/filterActions';
import * as filterConstants from '../constants/actionTypes/filterActionTypes';
import * as itemsListActions from '../actions/itemsListActions';
import * as itemsListConstants from '../constants/actionTypes/itemsListActionTypes';

describe('action-creators', () => {
    it('appActions addCategory', () => {
        const categoryName = 'category name';
        const action = appActions.addCategory(categoryName);

        expect(action.type).toBe(appConstants.ADD_CATEGORY);

        expect(typeof action.newCategory.ID).toBe('number');

        expect(action.newCategory.deleted[0].stateIndex).toBe(0);
        expect(action.newCategory.deleted[0].info).toBe(true);
        expect(action.newCategory.deleted[1].stateIndex).toBe(-1);
        expect(action.newCategory.deleted[1].info).toBe(false);

        expect(action.newCategory.name[0].stateIndex).toBe(0);
        expect(action.newCategory.name[0].info).toBe(categoryName);

        expect(action.newCategory.nestLevel).toBe(0);

        expect(typeof action.newCategory.subCategories).toBe('object');
        expect(action.newCategory.subCategories.length).toBe(0);

        expect(action.newCategory.opened[0].stateIndex).toBe(0);
        expect(action.newCategory.opened[0].info).toBe(false);

        expect(action.newCategory.selected[0].stateIndex).toBe(0);
        expect(action.newCategory.selected[0].info).toBe(false);

        expect(typeof action.newCategory.items).toBe('object');
        expect(action.newCategory.items.length).toBe(0);
    });

    it('appActions addItem', () => {
        const itemName = 'item name';
        const action = appActions.addItem(itemName);

        expect(action.type).toBe(appConstants.ADD_ITEM);

        expect(typeof action.newItem.ID).toBe('number');

        expect(action.newItem.deleted[0].stateIndex).toBe(0);
        expect(action.newItem.deleted[0].info).toBe(true);
        expect(action.newItem.deleted[1].stateIndex).toBe(-1);
        expect(action.newItem.deleted[1].info).toBe(false);

        expect(action.newItem.oldCategoryID[0].stateIndex).toBe(0);
        expect(action.newItem.oldCategoryID[0].info).toBe(-1);

        expect(action.newItem.oldPositionFromEnd[0].stateIndex).toBe(0);
        expect(action.newItem.oldPositionFromEnd[0].info).toBe(-1);

        expect(action.newItem.name[0].stateIndex).toBe(0);
        expect(action.newItem.name[0].info).toBe(itemName);

        expect(action.newItem.done[0].stateIndex).toBe(0);
        expect(action.newItem.done[0].info).toBe(false);

        expect(action.newItem.description[0].stateIndex).toBe(0);
        expect(action.newItem.description[0].info).toBe('');
    });

    it('appActions undo', () => {
        const action = appActions.undo();

        expect(action.type).toBe(appConstants.UNDO);
    });

    it('appActions redo', () => {
        const action = appActions.redo();

        expect(action.type).toBe(appConstants.REDO);
    });

    it('categoriesTreeActions categoryClicked', () => {
        const categoryId = 1;
        const action = categoriesTreeActions.categoryClicked(categoryId);

        expect(action.type).toBe(categoriesTreeConstants.CATEGORY_CLICKED);
        expect(action.categoryId).toBe(categoryId);
    });

    it('categoriesTreeActions editCategory', () => {
        const categoryId = 1;
        const categoryNewName = 'category new name';
        const action = categoriesTreeActions.editCategory(categoryId, categoryNewName);

        expect(action.type).toBe(categoriesTreeConstants.EDIT_CATEGORY);
        expect(action.categoryId).toBe(categoryId);
        expect(action.categoryNewName).toBe(categoryNewName);
    });

    it('categoriesTreeActions addSubCategory', () => {
        const categoryId = 1;
        const subCategoryName = 'subcategory name';
        const action = categoriesTreeActions.addSubCategory(categoryId, subCategoryName);

        expect(action.type).toBe(categoriesTreeConstants.ADD_SUB_CATEGORY);
        expect(action.categoryId).toBe(categoryId);
        expect(action.subCategoryName).toBe(subCategoryName);
    });

    it('categoriesTreeActions deleteCategory', () => {
        const categoryId = 1;
        const willSelectedCategoryBeDeleted = true;
        const action = categoriesTreeActions.deleteCategory(categoryId, willSelectedCategoryBeDeleted);

        expect(action.type).toBe(categoriesTreeConstants.DELETE_CATEGORY);
        expect(action.categoryId).toBe(categoryId);
        expect(action.willSelectedCategoryBeDeleted).toBe(willSelectedCategoryBeDeleted);
    });

    it('categoriesTreeActions moveItem', () => {
        const categoryId = 1;
        const editedItemId = 3;
        const action = categoriesTreeActions.moveItem(editedItemId, categoryId);

        expect(action.type).toBe(categoriesTreeConstants.MOVE_ITEM);
        expect(action.categoryId).toBe(categoryId);
        expect(action.editedItemId).toBe(editedItemId);
    });

    it('categoriesTreeActions categoryOpened', () => {
        const categoryId = 1;
        const action = categoriesTreeActions.categoryOpened(categoryId);

        expect(action.type).toBe(categoriesTreeConstants.CATEGORY_OPENED);
        expect(action.categoryId).toBe(categoryId);
    });

    it('editedItemActions cancel', () => {
        const action = editedItemActions.cancel();

        expect(action.type).toBe(editedItemConstants.CANCEL);
    });

    it('editedItemActions saveChanges', () => {
        const itemId = 1;
        const itemName = 'new item name';
        const itemStatus = true;
        const itemDescription = 'new item description';
        const action = editedItemActions.saveChanges(itemId, itemName, itemStatus, itemDescription);

        expect(action.type).toBe(editedItemConstants.SAVE_CHANGES);

        const itemToSave = action.itemToSave;

        expect(itemToSave.ID).toBe(itemId);
        expect(itemToSave.name).toBe(itemName);
        expect(itemToSave.done).toBe(itemStatus);
        expect(itemToSave.description).toBe(itemDescription);
    });

    it('filterActions filterItems', () => {
        const statusFilter = true;
        const textFilter = 'a';
        const action = filterActions.filterItems(statusFilter, textFilter);

        expect(action.type).toBe(filterConstants.FILTER_ITEMS);
        expect(action.status).toBe(statusFilter);
        expect(action.text).toBe(textFilter);
    });

    it('itemsListActions setItemStatus', () => {
        const itemId = 1;
        const action = itemsListActions.setItemStatus(itemId);

        expect(action.type).toBe(itemsListConstants.SET_ITEM_STATUS);
        expect(action.itemId).toBe(itemId);
    });

    it('itemsListActions editItem', () => {
        const itemId = 1;
        const action = itemsListActions.editItem(itemId);

        expect(action.type).toBe(itemsListConstants.EDIT_ITEM);
        expect(action.itemId).toBe(itemId);
    });
});