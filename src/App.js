import React, { Component } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';

import {connect} from 'react-redux';
import * as actions from './store/actions/index';


import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignUp();
  }
  

  render () {

    let routes = ( //for Authenticated users
          <Switch>
            <Route path="/burger" component={BurgerBuilder} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/orders" component={Orders} />
            <Route path="/logout" component={Logout} /> 
            <Redirect path="/" to="/burger" />
          </Switch>
    )

    if (!this.props.isAuthenticated) {
      routes = ( //for Unauthenticated users
        <Switch>
            <Route path="/burger" component={BurgerBuilder} />
            <Route path="/auth" component={Auth} />  
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
