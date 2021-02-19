import React, { Component } from 'react';
import axios from '../../axios-orders';

import {connect} from 'react-redux';
import * as actionCreators from '../../store/actions/index';

import Auxilary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

 
export class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        purchasing: false,
    }

    componentDidMount() {
        /* We now want to retreive the ingredients asynchronously from the firebase server, 
        within the Action Creators by using redux thunk */
        this.props.onInitIngredients();
        this.props.onFetchIngredientPrices();
    }

    updatePurchaseState () {
        const sum = Object.keys( this.props.ings )
            .map( igKey => {
                return this.props.ings[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        return sum > 0;
    }

    
    purchaseHandler = () => {
        if(this.props.isAuthenticated) {
            this.setState({purchasing: true});
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
        
    }

    

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {        
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render () {
        //Info about what buttons should be disabled inside the <BuildControls />
        const disabledInfo = {
            ...this.props.ings
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        //End result is:  {salad: true, meat: false, ...}


        //orderSummary changes to <Spinner/> after we click on the Continue Button and execute purchaseContinueHandler()
        let orderSummary = null;
        //

        /*Until the ingredients are retreived from the backend, 
        we are displaying a Spinner for the components using this.state.ingredients*/
        let burger = this.props.error ? <h2 style={{textAlign: 'center'}}>Ingredients Can't Be loaded</h2> : <Spinner />;
        if (this.props.ings) { 
            burger = (
                <Auxilary>
                <Burger ingredients={this.props.ings} />
                <BuildControls
                ingredientAdded={this.props.onIngredientAdded}
                ingredientRemoved={this.props.onIngredientRemoved}
                disabled={disabledInfo}
                purchasable={this.updatePurchaseState()}
                price={this.props.price} 
                ordered={this.purchaseHandler}
                isAuth={this.props.isAuthenticated}/>
                </Auxilary>);

            orderSummary = <OrderSummary 
            ingredients={this.props.ings}
            price={this.props.price}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />
        }
        /*****/
        

        
        return (
            <Auxilary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                   {orderSummary}
                </Modal>
                {burger}
            </Auxilary>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (ingredientName) => dispatch(actionCreators.addIngredient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(actionCreators.removeIngredient(ingredientName)),
        onInitIngredients: () => dispatch(actionCreators.initIngredients()),
        onFetchIngredientPrices: () => dispatch(actionCreators.fetchIngredientPrices()),
        onInitPurchase : () => dispatch(actionCreators.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));