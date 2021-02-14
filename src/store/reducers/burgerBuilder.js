import * as actionTypes from '../actions/actionTypes';
// import ingredientPrices from '../ingredientPrices';
import {updateObject} from '../utility';

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    ingredientPrices: null
};

const reducer = (state=initialState, action) => {
    // eslint-disable-next-line default-case
    switch(action.type) {

        case actionTypes.SET_INGREDIENTS :
            return updateObject(state, {
                ingredients: {
                    salad: action.ingredients.salad,
                    tomato: action.ingredients.tomato,
                    bacon: action.ingredients.bacon,
                    cheese: action.ingredients.cheese,
                    meat: action.ingredients.meat
                },
                error: false,
                totalPrice  : 4
            })

        case actionTypes.FETCH_INGREDIENTS_FAILED :
            return updateObject(state, {error: true});

        case actionTypes.ADD_INGREDIENT : 
            const updatedProperties = {
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName] : state.ingredients[action.ingredientName] + 1
                    },
                totalPrice: state.totalPrice + state.ingredientPrices[action.ingredientName]
            }
            return updateObject(state, updatedProperties);

        case actionTypes.REMOVE_INGREDIENT :
            const updatedProperties1 = {
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName] : state.ingredients[action.ingredientName] - 1
                },
                totalPrice: state.totalPrice - state.ingredientPrices[action.ingredientName]
            }
            return updateObject(state, updatedProperties1);

        case actionTypes.FETCH_INGREDIENT_PRICES_SUCCESS:
            return updateObject(state, {ingredientPrices: action.prices});
    }
    return state;
}

export default reducer;