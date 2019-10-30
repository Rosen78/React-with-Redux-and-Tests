/**
 * Created by Rosen_Nikolov on 1/9/2017.
 */

import React from 'react';
import renderer from 'react-test-renderer'
import AppWrapper from './../elements/AppWrapper'

it('should be rendered correctly', () => {
    const component = renderer.create(
        <AppWrapper />
    );

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
});