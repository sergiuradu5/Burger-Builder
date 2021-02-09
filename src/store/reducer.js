import * as actionTypes from './actions';
import ingredientPrices from './ingredientPrices';


const initialState = {
    ingredients: {
        salad: 0,
        tomato: 0,
        cheese: 0,
        bacon: 0,
        meat: 0
    },
    totalPrice: 4
};

const reducer = (state=initialState, action) => {
    // eslint-disable-next-line default-case
    switch(action.type) {
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