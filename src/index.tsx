import 'raf/polyfill';
import 'es6-shim';
import 'es6-promise';
// import 'reset-css/reset.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store/index';
import Test from './containers/desktop/Index';

ReactDOM.render(
    <Provider store={store}>
        <Test/>
    </Provider>,
    document.getElementById('root') 
);