import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary'; 

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component  {
        state = {
            error: null
        }

        //Even though componentWillMount() is deprecated, we have to is it over componentDidMount()
        //That is mainly because we need to set the interceptors before the WrappedComponent and its children mount
        //Thus, we are making sure that the interceptors are set just in time to intercept the errors in HTTP request / response 
        componentWillMount() {
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            })
            this.resInterceptor = axios.interceptors.response.use(res => res, 
                error => {
                    this.setState({error: error});
                    console.log(error);
                })
        }
        //We need componentWillUnmount because when we use the function withErrorHandler with many different pages inside the SPA,
        //... we are actually attaching multiple interceptors to the same axios instance
        //The interceptors are leaking memory, occupying unnecessary memory, hence we need to dispose them
        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            // axios.interceptors.resoponse.eject(this.resInterceptor);
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