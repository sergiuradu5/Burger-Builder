import React  from 'react';
import {connect} from 'react-redux';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const NavigationItems = (props) => {
    

    

    let authenticatedNavItem = <NavigationItem link="/auth">Authenticate</NavigationItem>; 
    if(props.isAuthenticated) {
        authenticatedNavItem = <NavigationItem link="/logout" >Log Out</NavigationItem>
    }

    return (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/burger" >Burger Builder</NavigationItem>
        {props.isAuthenticated ? <NavigationItem link="/orders">My Orders</NavigationItem> : null}
        {authenticatedNavItem}
    </ul>
    );
};

const mapStateToProps = (state) => {
    return {
        token: state.auth.token
    }
}


export default connect(mapStateToProps)(NavigationItems);