import React, { PureComponent } from 'react';
import {Redirect} from 'react-router-dom'; 
import {connect} from 'react-redux';
import * as actions from '../../../store/actions/index';
class Logout extends PureComponent {
    componentDidMount() {
        const auto = false;
        this.props.onLogout(auto);
    }

    render() {
        return <Redirect to="/burger" />
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: (auto) => dispatch(actions.logoutAndResetUserContactData(auto))
    }
}

export default connect(null, mapDispatchToProps)(Logout);


