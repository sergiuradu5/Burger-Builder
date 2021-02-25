import * as actionTypes from '../actions/actionTypes';
// import ingredientPrices from '../ingredientPrices';
import {updateObject} from '../../helpers/utility/utility';

const initialState = {
    ingredients: null,
    order: null,
    totalPrice: 4,
    error: false,
    ingredientPrices: null,
    building: false
};



const reducer = (state=initialState, action) => {
    // eslint-disable-next-line default-case
    switch(action.type) {

        case actionTypes.SET_INGREDIENTS :
            const ingredients = {
                    salad: action.ingredients.salad,
                    tomato: action.ingredients.tomato,
                    bacon: action.ingredients.bacon,
                    cheese: action.ingredients.cheese,
                    meat: action.ingredients.meat
            };

            return updateObject(state, {
                ingredients: ingredients,
                error: false,
                totalPrice  : 4,
                building: false
            })

        case actionTypes.FETCH_INGREDIENTS_FAILED :
            return updateObject(state, {error: true});

        case actionTypes.REORDER_INGREDIENTS :
            
            return updateObject(state, {
                    order: action.reorderedIngredients
                });

        case actionTypes.ADD_INGREDIENT : 
            const updatedProperties = {
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName] : state.ingredients[action.ingredientName] + 1
                    },
                totalPrice: state.totalPrice + state.ingredientPrices[action.ingredientName],
                building: true
            }
            return updateObject(state, updatedProperties);

        case actionTypes.REMOVE_INGREDIENT :
            const updatedProperties1 = {
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName] : state.ingredients[action.ingredientName] - 1
                },
                totalPrice: state.totalPrice - state.ingredientPrices[action.ingredientName],
                building: true
            }
            return updateObject(state, updatedProperties1);

        case actionTypes.FETCH_INGREDIENT_PRICES_SUCCESS:
            return updateObject(state, {ingredientPrices: action.prices});
        
        case actionTypes.FETCH_INGREDIENT_PRICES_FAILED:
            return updateObject(state, null);
    }
    return state;
}

export default reducer;