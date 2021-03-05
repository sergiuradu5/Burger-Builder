import React, { useState, useCallback } from 'react';
import {connect} from 'react-redux';
import Auxilary from '../Auxiliary/Auxiliary';
import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = (props) => {
    const [showSideDrawer, setShowSideDrawer] = useState(false);

    const sideDrawerClosedHandler = useCallback(() => {
        setShowSideDrawer( false );
    }, [setShowSideDrawer])

    const sideDrawerToggleHandler = useCallback(() => {
        setShowSideDrawer(prevState => {
            return !prevState
        });
    }, [setShowSideDrawer])

    
        return (
            <Auxilary>
                <Toolbar 
                isAuth = {props.isAuthenticated}
                drawerToggleClicked={sideDrawerToggleHandler} 
                />
                <SideDrawer
                    isAuth = {props.isAuthenticated}
                    open={showSideDrawer}
                    closed={sideDrawerClosedHandler} />
                <main className={classes.Content}>
                    {props.children}
                </main>
            </Auxilary>
        )
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.token !==null
    }
}

export default connect(mapStateToProps)(Layout);