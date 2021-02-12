import * as actionTypes from '../actions/actionTypes';
import ingredientPrices from '../ingredientPrices';


const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false
};

const reducer = (state=initialState, action) => {
    // eslint-disable-next-line default-case
    switch(action.type) {

        case actionTypes.SET_INGREDIENTS :
            return {
                ...state,
                ingredients: {
                    salad: action.ingredients.salad,
                    tomato: action.ingredients.tomato,
                    bacon: action.ingredients.bacon,
                    cheese: action.ingredients.cheese,
                    meat: action.ingredients.meat
                },
                error: false
            }

        case actionTypes.FETCH_INGREDIENTS_FAILED :
            return {
                ...state,
                error: true
            }

        case actionTypes.ADD_INGREDIENT : 
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName] : state.ingredients[action.ingredientName] + 1
                },
                totalPrice: state.totalPrice + ingredientPrices[action.ingredientName]
            };
        case actionTypes.REMOVE_INGREDIENT :
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName] : state.ingredients[action.ingredientName] - 1
                },
                totalPrice: state.totalPrice - ingredientPrices[action.ingredientName]
            };
    }
    return state;
}

export default reducer;