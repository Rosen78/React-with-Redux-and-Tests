/**
 * Created by Rosen_Nikolov on 1/9/2017.
 */

import React from 'react';
import { shallow, render, mount } from 'enzyme';
import CategoriesTree from './../elements/CategoriesTree';
import initialState from './../reducers/InitialState';
import * as categoriesTreeActions from '../actions/categoriesTreeActions';
import {getCategoryNameAddition } from './../helpers/helpers';
import getMuiTheme from '../../node_modules/material-ui/styles/getMuiTheme';

describe('CategoriesTree', () => {
    const mountWithContext = (node) => mount(node, {
        context: {
            muiTheme: getMuiTheme(),
        },
        childContextTypes: {
            muiTheme: React.PropTypes.object.isRequired,
        }
    });

    //There is a problem with this test - check the comment in its code
    it('should update color on click', () => {
        const component = shallow(
        <CategoriesTree
            categoriesAndItems={initialState.categoriesInfo.categoriesAndItems}
            categoriesTreeActions={categoriesTreeActions}
            mode={initialState.categoriesInfo.mode}
            editedItemId={initialState.categoriesInfo.editedItemId}
            getCategoryNameAddition={getCategoryNameAddition}
        />
        );

        const listItemFirst = component.find('ListItem').first();

        const listItemBackgroundColorBefore = listItemFirst.node.props.style.backgroundColor;

        //Problem with the test with this part
       // expect(listItemBackgroundColorBefore).toBe('');

        CategoriesTree.__Rewire__('setURI', () => {});

        listItemFirst.simulate('click');

        const listItemBackgroundColorAfter = listItemFirst.node.props.style.backgroundColor;

        expect(listItemBackgroundColorAfter).toBe('lightgreen');
    });
});
