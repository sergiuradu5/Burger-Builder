import React from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary'; 
import useHttpErrorHandler from '../../hooks/http-error-handler';
const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, clearError] = useHttpErrorHandler(axios);
       
        return (
        <Aux>
            <Modal show={error}
            modalClosed={clearError}>
                <h2 style={{color: 'red', textAlign: 'center'}}>{error ? error.message : null}</h2>
            </Modal>
            <WrappedComponent {...props} /> 
        </Aux>  
        );
    }
}

export default withErrorHandler;