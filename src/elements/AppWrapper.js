/**
 * Created by Rosen_Nikolov on 12/23/2016.
 */
import React, { Component} from 'react';
import {browserHistory} from 'react-router';
import {START_URL_PATH} from '../constants/additionalConstants';

export default class AppWrapper extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let path = browserHistory.getCurrentLocation().pathname;

        if(path === '/') {
            browserHistory.push(encodeURI(START_URL_PATH));
        }
    }

    render() {
        return(
            <div>{this.props.children}</div>
        )
    }
}

