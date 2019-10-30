/**
 * Created by Rosen_Nikolov on 11/28/2016.
 */
import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

class ItemsList extends Component {

    constructor(props) {
        super(props);

        this.setItems = this.setItems.bind(this);
    }

    //shouldComponentUpdate() {
       // return this.props.noCategorySelected === true ? false : true;
    //}

    setItemStatus(itemId) {
        this.props.itemsListActions.setItemStatus(itemId);
    }

    editItem(itemId, itemName) {
        this.props.editItem(itemId, itemName);
    }

    setItems() {
        const selectedItems = this.props.selectedItems;

        if ((selectedItems === undefined) || (selectedItems.length === 0)) {
            return (
                []
            );
        }

        return (
            selectedItems.map((item) => {
                return item.deleted === true ? null
                    :
                    (
                        <ListItem
                            key={item.ID}
                            primaryText={item.name}
                            leftCheckbox=
                                { <Checkbox
                                    checked={item.done}
                                    label=""
                                    onCheck={() => {this.setItemStatus(item.ID)}}
                                />}
                            rightIconButton=
                                {<IconButton onTouchTap={() => {this.editItem(item.ID, item.name)}}>
                                    <FontIcon className="material-icons">edit</FontIcon>
                                </IconButton>}
                        />
                    )
            })
        );
    }

    render() {
        return (
            <List>
                {this.setItems()}
            </List>
        );
    }
}

export default ItemsList;