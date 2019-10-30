/**
 * Created by Rosen_Nikolov on 12/1/2016.
 */
import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import RightIconButton from './RightIconButton';
import {browserHistory} from 'react-router';
import {getNewPath, setURI} from './../helpers/helpers';
import IconButton from 'material-ui/IconButton';

class CategoriesTree extends Component {

    constructor(props) {
        super(props);

        this.setCategoriesStart = this.setCategoriesStart.bind(this);
        this.categoryClicked = this.categoryClicked.bind(this);
    }

    setCategoriesStart() {
        return this.setCategories(this.props.categoriesAndItems);
    }

    categoryClicked(id, name) {
        this.props.categoriesTreeActions.categoryClicked(id);

        setURI(name, null, null, null);
        //const path = browserHistory.getCurrentLocation().pathname;
        //const newPath = getNewPath(path, name, null, null, null);
        //browserHistory.push(newPath);
    }

    toggleOpenCategoryState(event, categoryId) {
        event.stopPropagation();

        this.props.categoriesTreeActions.categoryOpened(categoryId);
    }

    setCategories(data) {
        return(
            data.map((category) =>
            {
                if(category.deleted === true) {
                    return ('')
                } else {
                    let categoryNameAddition = this.props.getCategoryNameAddition(category);

                    return (
                        <ListItem
                            key={category.ID}
                            insetChildren={true}
                            primaryText={<div style={{width:'230px', backgroundColor:'aliceblue', borderRadius:'10px'}}>{category.name + categoryNameAddition}</div>}
                            style={{width: 500 + category.nestLevel*18 + 'px', backgroundColor: category.selected ? 'lightgreen' : '', borderRadius:'10px'}}
                            className="categories-tree__list-item"
                            leftIcon={<IconButton  onClick={(event) => {this.toggleOpenCategoryState(event, category.ID)}}>
                                            <FontIcon className="material-icons categories-tree__list-item__left-icon">{category.opened === true ? 'check' : 'arrow_forward'}</FontIcon>
                                     </IconButton>}
                            rightIconButton={<div>
                                                <RightIconButton
                                                categoryId={category.ID}
                                                categoriesTreeActions={this.props.categoriesTreeActions}
                                                categoryName={category.name}
                                                selected={category.selected}
                                                categoriesAndItems={this.props.categoriesAndItems}
                                                mode={this.props.mode}
                                                editedItemId={this.props.editedItemId}
                                                />
                                              </div>}
                            primaryTogglesNestedList={true}
                            open={category.opened === true ? true : false}
                            nestedItems={[this.setCategories(category.subCategories)]}
                            onClick={() => {this.categoryClicked(category.ID, category.name)}}
                        />
                    )
                }
            })
        )
    }

    render() {
        return (
            <List>
                {this.setCategoriesStart()}
            </List>
        );
    }
}

export default CategoriesTree;