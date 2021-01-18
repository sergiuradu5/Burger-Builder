import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary'; 

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component  {
        state = {
            error: null
        }
        componentDidMount() {

            axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            })
            axios.interceptors.response.use(res => res, 
                error => {
                    this.setState({error: error});
                    console.log(error);
                })
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render() {
        return (
        <Aux>
            <Modal show={this.state.error}
            modalClosed={this.errorConfirmedHandler}>
                <h2 style={{color: 'red', textAlign: 'center'}}>{this.state.error ? this.state.error.message : null}</h2>
            </Modal>
            <WrappedComponent {...this.props} /> 
        </Aux>  
        );
    }
    }
}

export default withErrorHandler;