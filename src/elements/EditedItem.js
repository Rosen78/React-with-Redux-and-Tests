/**
 * Created by Rosen_Nikolov on 11/23/2016.
 */

import React, { Component } from 'react';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {NO_EDITED_ITEM} from '../constants/additionalConstants';
import {browserHistory} from 'react-router';
import {getNewPath} from '../helpers/helpers';

class EditedItem extends Component {
    constructor(props) {
        super(props);

        this.itemNameErrorText = '';
        this.done = this.props.editedItem.done;

        this.cancel = this.cancel.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    componentWillMount() {
        this.itemNameErrorText = '';
    }

    cancel() {
        this.props.editedItemActions.cancel();

        const path = browserHistory.getCurrentLocation().pathname;
        const newPath = getNewPath(path, null, null, null, NO_EDITED_ITEM);
        browserHistory.push(newPath);
    }

    saveChanges() {
        const itemName = this.refs.itemName.input.value;

        if(itemName === '') {
            this.itemNameErrorText = 'An item name should be entered.';
            this.setState({});

            return;
        }

        const itemStatus = this.refs.itemStatus.state.switched;
        const itemDescription = this.refs.itemDescription.input.refs.input.value;

        this.props.editedItemActions.saveChanges(this.props.editedItem.ID, itemName, itemStatus, itemDescription);

        const path = browserHistory.getCurrentLocation().pathname;
        const newPath = getNewPath(path, null, null, null, NO_EDITED_ITEM);
        browserHistory.push(newPath);
    }

    render() {
        if(this.props.editedItem.name === undefined) {
            return null;
        }

        return (
                    <div>
                        <Toolbar>
                            <ToolbarGroup firstChild={true}>
                            </ToolbarGroup>
                            <ToolbarGroup>
                                <RaisedButton style={{height:'40px'}} label="Save changes" onClick={this.saveChanges}/>
                                <RaisedButton style={{height:'40px'}} label="Cancel" onClick={this.cancel} />
                            </ToolbarGroup>
                        </Toolbar>
                        <TextField
                            id="1"
                            ref="itemName"
                            style={{float:'left', marginBottom: '15px'}}
                            defaultValue={this.props.editedItem.name}
                            errorText={this.itemNameErrorText}
                        />
                        <Checkbox
                            ref="itemStatus"
                            style={{clear:'both', display:'block', width:'150px'}}
                            label="Done"
                            checked={this.done}
                            onCheck={() => {this.done = !this.done; this.setState({});}}
                        />
                        <TextField
                            id="2"
                            ref="itemDescription"
                            style={{width:'100%'}}
                            hintText="Description"
                            multiLine={true}
                            rows={10}
                            defaultValue={this.props.editedItem.description}
                        />
                    </div>
        );
    }
}

export default EditedItem;
