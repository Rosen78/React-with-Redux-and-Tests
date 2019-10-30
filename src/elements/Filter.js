/**
 * Created by Rosen_Nikolov on 12/1/2016.
 */
import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import {ToolbarGroup} from 'material-ui/Toolbar';
import {browserHistory} from 'react-router';
import {getNewPath} from './../helpers/helpers';
import {NO_FILTER_TEXT, FILTER_STATUS_ALL, FILTER_STATUS_ONLY_DONE} from '../constants/additionalConstants';

class Filter extends Component {

    constructor(props) {
        super(props);

        this.filterItemsStatus = this.filterItemsStatus.bind(this);
        this.filterItemsText = this.filterItemsText.bind(this);
        this.removeFilterText = this.removeFilterText.bind(this);
    }

    componentDidUpdate() {
        this.refs.filterItemText.input.value = this.props.itemsFilter.text;
    }

    filterItemsStatus() {
        const filterItemStatus = !this.refs.filterItemStatus.state.switched;
        const filterItemText = this.refs.filterItemText.input.value;

        this.props.filterActions.filterItems(filterItemStatus, filterItemText);

        const path = browserHistory.getCurrentLocation().pathname;
        const newPath =
            getNewPath(path, null, filterItemStatus === false ? FILTER_STATUS_ALL : FILTER_STATUS_ONLY_DONE, null, null);
        browserHistory.push(newPath);
    }

    filterItemsText() {
        const filterItemStatus = this.refs.filterItemStatus.state.switched;
        const filterItemText = this.refs.filterItemText.input.value;

        this.props.filterActions.filterItems(filterItemStatus, filterItemText);

        const path = browserHistory.getCurrentLocation().pathname;
        const newPath = getNewPath(path, null, null, filterItemText !== '' ? filterItemText : NO_FILTER_TEXT, null);
        browserHistory.push(newPath);
    }

    removeFilterText() {
        this.refs.filterItemText.input.value = '';

        const filterItemStatus = this.refs.filterItemStatus.state.switched;
        const filterItemText = '';

        this.props.filterActions.filterItems(filterItemStatus, filterItemText);

        const path = browserHistory.getCurrentLocation().pathname;
        const newPath = getNewPath(path, null, null, NO_FILTER_TEXT, null);
        browserHistory.push(newPath);
    }

    render() {
        return (
            <ToolbarGroup>
                <Checkbox
                    ref="filterItemStatus"
                    checked={this.props.itemsFilter.status}
                    style={{width:'100px'}}
                    label="Show done"
                    onCheck={this.filterItemsStatus}
                />
                <TextField
                    ref="filterItemText"
                    defaultValue={this.props.itemsFilter.text}
                    style={{marginLeft:'10px'}}
                    hintText="Search"
                    onChange={this.filterItemsText}
                />
                <IconButton onTouchTap={this.removeFilterText}>
                    <FontIcon className="material-icons">close</FontIcon>
                </IconButton>
            </ToolbarGroup>
        );
    }
}

export default Filter;