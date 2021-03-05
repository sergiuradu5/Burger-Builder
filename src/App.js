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

  const { onTryAutoSignUp } = props; //object destructuring
  useEffect(() => {
    props.onTryAutoSignUp();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTryAutoSignUp])
  
    let routes = ( //for Authenticated users
      // <Suspense /> Used here for asynchronous (lazy) loading of the componentes
          <Switch>
            <Route path="/burger" render={(props) => <BurgerBuilder {...props}/>} />
            <Route path="/checkout" render={(props) => (
              <Suspense fallback={<div style={{align: 'center'}}> <Spinner /></div>}>
                <Checkout {...props}/>
              </Suspense>
            )} />
            <Route path="/orders" render={(props) => (
              <Suspense fallback={<div> </div>}>
                <Orders {...props}/>
              </Suspense>
            )} />
            <Route path="/logout" render={(props) => <Logout {...props}/>} />
            <Route path="/auth" render={(props) => (
              <Suspense fallback={<div style={{align: 'center'}}> <Spinner /></div>}>
                <Auth {...props}/>
              </Suspense>
            )} />
            <Redirect path="/" to="/burger" />
          </Switch>
    )

    if (!props.isAuthenticated) {
      routes = ( //for Unauthenticated users
        <Switch>
            <Route path="/burger" render={(props) => <BurgerBuilder {...props}/>} />
            <Route path="/auth" render={(props) => (
              <Suspense fallback={<div style={{align: 'center'}}> <Spinner /></div>}>
                <Auth {...props}/>
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
