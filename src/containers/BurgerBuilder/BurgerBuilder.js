import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../axios-orders';

import {useSelector, useDispatch} from 'react-redux';
import * as actionCreators from '../../store/actions/index';

import Auxilary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

 
export const BurgerBuilder = (props) => {
    
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients
    });
    const price = useSelector(state => {
        return state.burgerBuilder.totalPrice
    })
    const error = useSelector(state => {
        return state.burgerBuilder.error
    })
    const isAuthenticated = useSelector(state =>{
        return state.auth.token !== null
    })

  
    const onIngredientAdded = (ingredientName) => dispatch(actionCreators.addIngredient(ingredientName));
    const onIngredientRemoved = (ingredientName) => dispatch(actionCreators.removeIngredient(ingredientName));
    const onInitIngredients =  useCallback(
        () => dispatch(actionCreators.initIngredients()), [dispatch]);
    const onFetchIngredientPrices = useCallback(
        () => dispatch(actionCreators.fetchIngredientPrices()), [dispatch]); 
    const onInitPurchase  = () => dispatch(actionCreators.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actionCreators.setAuthRedirectPath(path))

    useEffect(() => {
        /* We now want to retreive the ingredients asynchronously from the firebase server; 
        within the Action Creators by using redux thunk */
        onInitIngredients();
        onFetchIngredientPrices();
    }, [onInitIngredients, onFetchIngredientPrices]);

    const updatePurchaseState = () => {
        const sum = Object.keys( ings )
            .map( igKey => {
                return ings[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        return sum > 0;
    }

    
   const purchaseHandler = () => {
        if(isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
        
    }

    

   const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {        
        onInitPurchase();
        props.history.push('/checkout');
    }

    
        //Info about what buttons should be disabled inside the <BuildControls />
        const disabledInfo = {
            ...ings
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        //End result is:  {salad: true, meat: false, ...}


        //orderSummary changes to <Spinner/> after we click on the Continue Button and execute purchaseContinueHandler()
        let orderSummary = null;
        //

        /*Until the ingredients are retreived from the backend, 
        we are displaying a Spinner for the components using state.ingredients*/
        let burger = error ? <h2 style={{textAlign: 'center'}}>Ingredients Can't Be loaded</h2> : <Spinner />;
        if (ings) { 
            burger = (
                <Auxilary>
                <Burger ingredients={ings} />
                <BuildControls
                ingredientAdded={onIngredientAdded}
                ingredientRemoved={onIngredientRemoved}
                disabled={disabledInfo}
                purchasable={updatePurchaseState()}
                price={price} 
                ordered={purchaseHandler}
                isAuth={isAuthenticated}/>
                </Auxilary>);

            orderSummary = <OrderSummary 
            ingredients={ings}
            price={price}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler} />
        }
        /*****/
        

        
        return (
            <Auxilary>
                <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                   {orderSummary}
                </Modal>
                {burger}
            </Auxilary>
        );
}


export default withErrorHandler(BurgerBuilder, axios);