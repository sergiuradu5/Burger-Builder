import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';

class App extends Component {
  render () {
    return (
        <Layout>
          <Route path="/burger" component={BurgerBuilder} />
          <Route path="/checkout" component={Checkout} />
          <Redirect path="/" to="/burger" />
        </Layout>
        
      
    );
  }
}

export default App;
