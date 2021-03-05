import React, { useEffect } from 'react';
import {Redirect} from 'react-router-dom'; 
import {connect} from 'react-redux';
import * as actions from '../../../store/actions/index';
const Logout = (props) =>  {
    const { onLogout } = props;

    useEffect(() => {
        const auto = false;
        props.onLogout(auto);
    }, [onLogout ])
    
        return <Redirect to="/burger" />
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: (auto) => dispatch(actions.logoutAndResetUserContactData(auto))
    }
}

export default connect(null, mapDispatchToProps)(Logout);


