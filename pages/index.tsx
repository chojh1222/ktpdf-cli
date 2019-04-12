import 'raf/polyfill';
import 'es6-shim';
import 'es6-promise';
// import 'reset-css/reset.css';
import * as React from 'react';
import Index from '../src/containers/desktop/Index';

class About extends React.Component<null, React.ComponentState> {
    render() {
        return(
            <div>
              <Index />
            </div>
        );
    }
}

export default About;