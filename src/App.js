import React, {useEffect} from 'react';
import {Suspense} from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';

import {connect} from 'react-redux';
import * as actions from './store/actions/index';


import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';

import Logout from './containers/Auth/Logout/Logout';
import Spinner from './components/UI/Spinner/Spinner';

const Checkout = React.lazy( () => import('./containers/Checkout/Checkout'));
const Auth = React.lazy( () => import ('./containers/Auth/Auth'));
const Orders = React.lazy( () => import ('./containers/Orders/Orders'));


const App = (props) => {
  useEffect(() => {
    props.onTryAutoSignUp();
  })
  
    let routes = ( //for Authenticated users
      // <Suspense /> Used here for asynchronous (lazy) loading of the componentes
          <Switch>
            <Route path="/burger" component={BurgerBuilder} />
            <Route path="/checkout" render={() => (
              <Suspense fallback={<div style={{align: 'center'}}> <Spinner /></div>}>
                <Checkout />
              </Suspense>
            )} />
            <Route path="/orders" render={() => (
              <Suspense fallback={<div> </div>}>
                <Orders />
              </Suspense>
            )} />
            <Route path="/logout" component={Logout} />
            <Route path="/auth" render={() => (
              <Suspense fallback={<div style={{align: 'center'}}> <Spinner /></div>}>
                <Auth />
              </Suspense>
            )} />
            <Redirect path="/" to="/burger" />
          </Switch>
    )

    if (!props.isAuthenticated) {
      routes = ( //for Unauthenticated users
        <Switch>
            <Route path="/burger" component={BurgerBuilder} />
            <Route path="/auth" render={() => (
              <Suspense fallback={<div style={{align: 'center'}}> <Spinner /></div>}>
                <Auth />
              </Suspense>
            )} />
            <Redirect path="/" to="/burger" />
          </Switch>
      )
    }

    return (
        
        <Layout>
          
          {routes}
        </Layout>
        
      
    );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
