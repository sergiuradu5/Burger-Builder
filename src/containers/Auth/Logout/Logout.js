import React, { PureComponent } from 'react';
import {Redirect} from 'react-router-dom'; 
import {connect} from 'react-redux';
import * as actions from '../../../store/actions/index';
class Logout extends PureComponent {
    componentDidMount() {
        this.props.onLogout();
    }

    render() {
        return <Redirect to="/burger" />
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    }
}

export default connect(null, mapDispatchToProps)(Logout);


