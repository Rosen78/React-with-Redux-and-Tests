/**
 * Created by Rosen_Nikolov on 12/2/2016.
 */

import React, {PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

export default class DialogManageCategory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            errorMessage: ''
        };

        this.handleOpen = (event) => {
            event.stopPropagation();
            this.setState({ open: true, errorMessage: '' });
        };

        this.handleClose = () => {
            this.setState({ open: false });
        };

        this.handleSubmit = () => {
            if((this.props.dialogType !== 2) && (this.props.dialogType !== 4)) {
                this.errorMessage = '';
                const categoryName = this.refs.categoryName.input.value;

                if (categoryName == '') {
                    this.errorMessage = 'You should enter a category name.';
                    this.setState({});
                    return;
                }

                this.props.handleManageCategory(categoryName);
                this.setState({open: false});
            } else {
                this.props.handleManageCategory();
                this.setState({open: false});
            }
        };
    }

    render() {

        const actions = [
            <FlatButton
                key = {0}
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                key = {1}
                label="OK"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleSubmit}
            />
        ];

        return (
            <div>
                {this.props.dialogType === 0 ? <RaisedButton
                    className="category-dialog__button"
                    label={this.props.buttonText}
                    onTouchTap={this.handleOpen}
                    backgroundColor = {'#EF5350'}
                    labelColor = {'#FFF'}
                    disabled={this.props.disabled}
                />
                : this.props.dialogType === 1 ?
                    <IconButton  onClick={(event) => {this.handleOpen(event)}}>
                        <FontIcon className="material-icons">edit</FontIcon>
                    </IconButton>
                    : this.props.dialogType === 2 ?
                    <IconButton  onClick={(event) => {this.handleOpen(event)}}>
                        <FontIcon className="material-icons">delete</FontIcon>
                    </IconButton>
                    : this.props.dialogType === 3 ?
                    <IconButton  onClick={(event) => {this.handleOpen(event)}}>
                        <FontIcon className="material-icons">add</FontIcon>
                    </IconButton>
                    :
                    <IconButton  onClick={(event) => {this.handleOpen(event)}}>
                        <FontIcon className="material-icons">arrow_back</FontIcon>
                    </IconButton>
                }
                <Dialog
                    title={this.props.title}
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    { this.props.dialogType === 2 || this.props.dialogType === 4 ? '' :
                        <div>
                            <TextField ref="categoryName" hintText="Enter category name" defaultValue={this.props.dialogType === 1 ? this.props.categoryName : ''} />
                            <div style={{color:'red'}}>{this.errorMessage}</div>
                        </div>
                    }
                </Dialog>
            </div>
        );
    }
}

DialogManageCategory.propTypes = {
    title: PropTypes.string,
    actions: PropTypes.object,
    text: PropTypes.array,
    handleDropBtnClick: PropTypes.func,
    buttonText: PropTypes.string,
    disabled: PropTypes.boolean
};

