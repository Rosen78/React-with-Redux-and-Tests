import React, { Component,  PropTypes} from 'react';
import './../style/App.css';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
    lightGreen500,
    lightGreen700,
    grey400,
    amber500,
    grey100,
    grey500,
    darkBlack,
    white,
    grey300,
    fullBlack
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';
import ItemsList from './ItemsList';
import CategoriesTree from './CategoriesTree';
import Filter from './Filter';
import EditedItem from './EditedItem';
import DialogManageCategory from './DialogManageCategory';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as categoriesTreeActions from '../actions/categoriesTreeActions';
import * as appActions from '../actions/appActions';
import * as itemsListActions from '../actions/itemsListActions';
import * as filterActions from '../actions/filterActions';
import * as editedItemActions from '../actions/editedItemActions';
import {findSelectedItems, traverseCategories, getPropertyValue} from '../helpers/helpers';

import {getNewPath, getCategoryNameAddition} from '../helpers/helpers';
import {browserHistory} from 'react-router';
//import { ActionCreators } from 'redux-undo-immutable';

class App extends Component {
    constructor(props) {
        super(props);

        this.progressNumber = 0;
        this.handleManageCategory = this.handleManageCategory.bind(this);
        this.addItem = this.addItem.bind(this);
        this.filterItems = this.filterItems.bind(this);
        this.editItem = this.editItem.bind(this);
        this.undoState = this.undoState.bind(this);
        this.redoState = this.redoState.bind(this);
        this.transformData = this.transformData.bind(this);
    }

    handleManageCategory(categoryName) {
        this.props.appActions.addCategory(categoryName);
    }

    filterItems() {
        const filterItemsStatus = this.propertiesInfo.itemsFilter.status;
        const filterItemsText = this.propertiesInfo.itemsFilter.text;

        let newSelectedItems = [];

        for(let i = 0; i < this.selectedItems.length; i++) {
            const item = this.selectedItems[i];
            if(
                ((item.done === true) || (filterItemsStatus === false))
                && ((filterItemsText == '') || (item.name.indexOf(filterItemsText) !== -1))
            ) {
                newSelectedItems.push(item);
            }
        }

        this.selectedItems = newSelectedItems;
    }

    calculateProgress = () => {
        const calculateProgressInner = (categoryInfo) => {
            if(categoryInfo.deleted === false) {
                countCategories++;

                if (getCategoryNameAddition(categoryInfo) !== '') {
                    countDoneOrEmptyCategories++;
                }
            }

            return false;
        }

        this.progressNumber = 0;

        let countCategories = 0;
        let countDoneOrEmptyCategories = 0;

        traverseCategories(null, this.propertiesInfo.categoriesAndItems, calculateProgressInner);

        this.progressNumber = countCategories === 0 ? 100 : (countDoneOrEmptyCategories / countCategories) * 100;
    }

    addItem() {
        const itemName = this.refs.itemName.input.value;
        this.props.appActions.addItem(itemName);
    }

    findEditedItem(itemId) {
        const findEditedItemInner = (categoryInfo, resultObject, inputObject) => {
            // It is not possible to optimize here to search only in the selected category - it is not always the case now
            for (let i = 0; i < categoryInfo.items.length; i++) {
                const item = categoryInfo.items[i];
                if (item.ID === inputObject.itemId) {
                    resultObject.editedItem = item;

                    return true;
                }
            }

            return false;
        }

        const inputObject = {};
        inputObject.itemId = itemId;

        const resultObject = {};

        traverseCategories(null, this.propertiesInfo.categoriesAndItems, findEditedItemInner, resultObject, inputObject);

        return resultObject.editedItem;
    }

    editItem(itemId, itemName) {
        this.props.itemsListActions.editItem(itemId);

        const path = browserHistory.getCurrentLocation().pathname;
        const newPath = getNewPath(path, null, null, null, itemName);
        browserHistory.push(newPath);
    }

    undoState() {
        this.props.appActions.undo();
    }

    redoState() {
        this.props.appActions.redo();
    }

    transformData(categoriesInfo, currentStateIndex) {
        const transformDataInner = (categoriesAndItemsSender, categoriesAndItemsReceiver) => {
            for(let i = 0; i < categoriesAndItemsSender.length; i++) {
                let categoryAndItemsSender = categoriesAndItemsSender[i];

                let infoReceiver = {};
                infoReceiver.ID = categoryAndItemsSender.ID;
                infoReceiver.nestLevel = categoryAndItemsSender.nestLevel;
                infoReceiver.deleted = getPropertyValue(categoryAndItemsSender.deleted, currentStateIndex);
                infoReceiver.name = getPropertyValue(categoryAndItemsSender.name, currentStateIndex);
                infoReceiver.opened = getPropertyValue(categoryAndItemsSender.opened, currentStateIndex);
                infoReceiver.selected = getPropertyValue(categoryAndItemsSender.selected, currentStateIndex);

                infoReceiver.items = [];
                let itemsSender = categoryAndItemsSender.items;
                for(let k = 0; k < itemsSender.length; k++) {
                    let itemSender = itemsSender[k];

                    let infoItemReceiver = {};
                    infoItemReceiver.ID = itemSender.ID;
                    infoItemReceiver.deleted = getPropertyValue(itemSender.deleted, currentStateIndex);
                    infoItemReceiver.name = getPropertyValue(itemSender.name, currentStateIndex);
                    infoItemReceiver.done = getPropertyValue(itemSender.done, currentStateIndex);
                    infoItemReceiver.description = getPropertyValue(itemSender.description, currentStateIndex);

                    infoReceiver.items.push(infoItemReceiver);
                }

                infoReceiver.subCategories = [];
                transformDataInner(categoryAndItemsSender.subCategories, infoReceiver.subCategories);

                categoriesAndItemsReceiver.push(infoReceiver);
            }
        }

        let properties = {};

        properties.currentStateIndex = categoriesInfo.currentStateIndex;
        properties.lastStateIndex = categoriesInfo.lastStateIndex;
        properties.mode = getPropertyValue(categoriesInfo.mode, currentStateIndex);
        properties.addItemError = getPropertyValue(categoriesInfo.addItemError, currentStateIndex);
        properties.itemsFilter = {};
        properties.itemsFilter.status = getPropertyValue(categoriesInfo.itemsFilter.status, currentStateIndex);
        properties.itemsFilter.text = getPropertyValue(categoriesInfo.itemsFilter.text, currentStateIndex);
        properties.editedItemId = getPropertyValue(categoriesInfo.editedItemId, currentStateIndex);
        properties.noCategorySelected = getPropertyValue(categoriesInfo.noCategorySelected, currentStateIndex);

        properties.categoriesAndItems = [];
        transformDataInner(categoriesInfo.categoriesAndItems, properties.categoriesAndItems);

        this.propertiesInfo = properties;
    }

    render() {
        const currentStateIndex = this.props.categoriesInfo.currentStateIndex;

        this.transformData(this.props.categoriesInfo, currentStateIndex);

        this.calculateProgress();

        this.selectedItems = findSelectedItems(this.propertiesInfo.categoriesAndItems);
        if(this.selectedItems === undefined) {
            this.selectedItems = [];
        }

        if(this.propertiesInfo.mode === 'selectedCategory') {
            this.filterItems();
        }

        if(this.propertiesInfo.mode === 'selectedItem') {
            this.editedItem = this.findEditedItem(this.propertiesInfo.editedItemId);
        } else {
            this.editedItem = {};
        }

        const muiTheme = getMuiTheme({
          palette: {
              primary1Color: lightGreen500,
              primary2Color: lightGreen700,
              primary3Color: grey400,
              accent1Color: amber500,
              accent2Color: grey100,
              accent3Color: grey500,
              textColor: darkBlack,
              alternateTextColor: white,
              canvasColor: white,
              borderColor: grey300,
              disabledColor: fade(darkBlack, 0.3),
              pickerHeaderColor: lightGreen500,
              clockCircleColor: fade(darkBlack, 0.07),
              shadowColor: fullBlack
          }
      });

      const dialogTitle = 'Add category';
      const dialogButtonText = 'Add category';



    return (
        <MuiThemeProvider muiTheme={muiTheme}>
      <div className="App">
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <label style={{marginLeft:'10px'}}>To-Do List</label>
              <RaisedButton label="Undo" onClick={this.undoState} />
              <RaisedButton label="Redo" onClick={this.redoState} />
          </ToolbarGroup>
            <Filter
                filterItems={this.filterItems}
                filterActions={this.props.filterActions}
                itemsFilter={this.propertiesInfo.itemsFilter}
                />
        </Toolbar>

          <LinearProgress mode="determinate" value={this.progressNumber} />

          <Toolbar>
              <ToolbarGroup firstChild={true}>
                  <DialogManageCategory
                      {...this.props}
                      dialogType={0}
                      title={dialogTitle}
                      text={""}
                      handleManageCategory={this.handleManageCategory}
                      buttonText={dialogButtonText}
                  />
              </ToolbarGroup>
              <ToolbarGroup>
                  <TextField ref="itemName" hintText="TODO item name" />
                  <RaisedButton label="Add" onClick={this.addItem} />
                  <div style={{color: 'red'}}>{this.propertiesInfo.addItemError}</div>
              </ToolbarGroup>
          </Toolbar>

          <div style={{float:'left', overflow:'scroll', width:'65%', height:'500px'}}>
              <CategoriesTree
                  categoriesAndItems={this.propertiesInfo.categoriesAndItems}
                  categoriesTreeActions={this.props.categoriesTreeActions}
                  mode={this.propertiesInfo.mode}
                  editedItemId={this.propertiesInfo.editedItemId}
                  getCategoryNameAddition={getCategoryNameAddition}
              />
          </div>
          <div style={{float:'right', overflow:'scroll', width:'25%', height:'500px', display: this.propertiesInfo.noCategorySelected === false ? 'block' : 'none'}}>
              {
                  this.propertiesInfo.mode === 'selectedCategory' ?
                      <ItemsList
                          selectedItems={this.selectedItems}
                          itemsListActions={this.props.itemsListActions}
                          editItem={this.editItem}
                          noCategorySelected={this.propertiesInfo.noCategorySelected}
                      />
                      :
                      <EditedItem
                          editedItem={this.editedItem}
                          editedItemActions={this.props.editedItemActions}
                      />
              }
          </div>
      </div>
        </MuiThemeProvider>
    );
  }
}

App.propTypes = {
    categoriesInfo: PropTypes.object.isRequired
};

App.defaultProps = {categoriesInfo: { mode: 'selectedCategory', categoriesAndItems: []}};

function mapStateToProps(state) {
    return {
        categoriesInfo: state.categoriesInfo
    };
}

function mapDispatchToProps(dispatch) {
    return {
        categoriesTreeActions: bindActionCreators(categoriesTreeActions, dispatch),
        appActions:  bindActionCreators(appActions, dispatch),
        itemsListActions: bindActionCreators(itemsListActions, dispatch),
        filterActions: bindActionCreators(filterActions, dispatch),
        editedItemActions: bindActionCreators(editedItemActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

