/**
 * Created by Rosen_Nikolov on 11/28/2016.
 */
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import DialogManageCategory from './DialogManageCategory';
import {browserHistory} from 'react-router';
import {getNewPath, traverseCategories} from '../helpers/helpers';
import {NO_CATEGORY, NO_EDITED_ITEM} from '../constants/additionalConstants';

class RightIconButton extends Component {

    constructor(props) {
        super(props);

        this.handleManageEditCategory = this.handleManageEditCategory.bind(this);
        this.handleManageAddSubCategory = this.handleManageAddSubCategory.bind(this);
        this.handleManageDeleteCategory = this.handleManageDeleteCategory.bind(this);
        this.handleManageMoveItem = this.handleManageMoveItem.bind(this);
    }

    handleManageEditCategory(categoryName) {
        this.props.categoriesTreeActions.editCategory(this.props.categoryId, categoryName);
        if(this.props.selected === true) {
            const path = browserHistory.getCurrentLocation().pathname;
            const newPath = getNewPath(path, categoryName, null, null, null);
            browserHistory.push(newPath);
        }
    }

    handleManageAddSubCategory(subCategoryName) {
        this.props.categoriesTreeActions.addSubCategory(this.props.categoryId, subCategoryName);
    }

    // The algorithm depends on the order the traversal of the categories is made.
    checkWillSelectedCategoryBeDeleted(categoryId) {
            const checkWillSelectedCategoryBeDeletedInner = (categoryInfo, resultObject, inputObject) => {
                if((resultObject.foundCategoryToBeDeleted === true) &&
                    (categoryInfo.nestLevel <= resultObject.categoryToBeDeletedNestLevel)) {
                    if(resultObject.willSelectedCategoryBeDeleted !== true) {
                        resultObject.willSelectedCategoryBeDeleted = false;
                    }

                    return true;
                }

                if(categoryInfo.ID === inputObject.categoryId) {
                    resultObject.foundCategoryToBeDeleted = true;
                    resultObject.categoryToBeDeletedNestLevel = categoryInfo.nestLevel;
                }

                if((resultObject.foundCategoryToBeDeleted === true) && (categoryInfo.selected === true)) {
                    resultObject.willSelectedCategoryBeDeleted = true;

                    return true;
                }

                return false;
            }

        const categoryIdWrapper = {
            categoryId: categoryId
        }

        let willSelectedCategoryBeDeletedWrapper = {};
        traverseCategories(null, this.props.categoriesAndItems,
            checkWillSelectedCategoryBeDeletedInner, willSelectedCategoryBeDeletedWrapper, categoryIdWrapper);

        return willSelectedCategoryBeDeletedWrapper.willSelectedCategoryBeDeleted;
    }

    handleManageDeleteCategory() {
        const willSelectedCategoryBeDeleted = this.checkWillSelectedCategoryBeDeleted(this.props.categoryId);

        this.props.categoriesTreeActions.deleteCategory(this.props.categoryId, willSelectedCategoryBeDeleted);

        if(willSelectedCategoryBeDeleted == true) {
            const path = browserHistory.getCurrentLocation().pathname;
            const newPath = getNewPath(path, NO_CATEGORY, null, null, NO_EDITED_ITEM);
            browserHistory.push(newPath);
        }
    }

    handleManageMoveItem() {
        this.props.categoriesTreeActions.moveItem(this.props.editedItemId, this.props.categoryId);
    }

    getEditedItemCategoryId(editedItemId) {
        const getEditedItemCategoryIdInner = (categoryInfo, resultObject, inputObject) => {
            // It is not possible to optimize here to search only in the selected category - it is not always the case now
            for (let i = 0; i < categoryInfo.items.length; i++) {
                const item = categoryInfo.items[i];
                if (item.ID === inputObject.editedItemId) {
                    resultObject.editedItemCategoryId = categoryInfo.ID;

                    return true;
                }
            }

            return false;
        }

        const resultObject = {editedItemCategoryId: undefined};

        const inputObject = {};
        inputObject.editedItemId = editedItemId;

        traverseCategories(null, this.props.categoriesAndItems, getEditedItemCategoryIdInner, resultObject, inputObject);

        return resultObject.editedItemCategoryId;

    }

    render() {
        const dialogTitleEditCategory = `Edit category ${this.props.categoryName}`;
        const dialogTitleAddSubCategory = `Add subcategory of category ${this.props.categoryName}`;
        const dialogTitleDeleteCategory = `Do you want to delete the category ${this.props.categoryName}?`;
        const dialogTitleMoveItem = `Move the item to category ${this.props.categoryName}?`;

        this.editedItemCategoryId = this.getEditedItemCategoryId(this.props.editedItemId);

        return (
            <div>
                { this.props.mode === 'selectedCategory' ?
                    <div>
                        <div style={{float:'left', width:'150px'}}>
                            <DialogManageCategory
                                {...this.props}
                                dialogType={1}
                                title={dialogTitleEditCategory}
                                text={""}
                                handleManageCategory={this.handleManageEditCategory}
                                buttonText={""}
                                categoryName={this.props.categoryName}
                            />
                        </div>
                        < div style={{float:'right', width:'50px'}}>
                            <DialogManageCategory
                                {...this.props}
                                dialogType={3}
                                title={dialogTitleAddSubCategory}
                                text={""}
                                handleManageCategory={this.handleManageAddSubCategory}
                                buttonText={""}
                            />
                        </div>
                        <div style={{float:'right', width:'50px'}}>
                            <DialogManageCategory
                                {...this.props}
                                dialogType={2}
                                title={dialogTitleDeleteCategory}
                                text={""}
                                handleManageCategory={this.handleManageDeleteCategory}
                                buttonText={""}
                            />
                        </div>
                    </div>
                    : this.editedItemCategoryId === this.props.categoryId ?
                    ''
                    :
                    <div>
                        <div style={{float:'right', width:'50px'}}>
                            <DialogManageCategory
                                {...this.props}
                                dialogType={4}
                                title={dialogTitleMoveItem}
                                text={""}
                                handleManageCategory={this.handleManageMoveItem}
                                buttonText={""}
                            />
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default RightIconButton;