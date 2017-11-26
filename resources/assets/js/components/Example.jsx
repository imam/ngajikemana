import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Example extends Component {
    render() {
        return (

            <div>
                <div className="panel-heading">Example Component</div>

                <div className="panel-body">
                    I'm an example component!
                </div>
            </div>

        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
