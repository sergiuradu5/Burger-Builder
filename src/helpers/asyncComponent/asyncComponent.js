import React, { Component } from 'react';
//Takes on a function as argument which returns a promise
//This promise returns a component which will subsequently be lazy loaded (code loads when needed)
//asyncComponent eventually retuns an anonymous class in which the wrapped asynchronous component is stored in state when the anonymous component mounts

const asyncComponent = (importComponent) => {
    return class extends Component {

        state= {
            component: null
        };

        componentDidMount() {
            importComponent()
                .then(comp => {
                    this.setState({component: comp.default});
                });
            }

        render() {
            const C = this.state.component;

            return C ? <C {...this.props} /> : null;
        }
    }
}

export default asyncComponent;