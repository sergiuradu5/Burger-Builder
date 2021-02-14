import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (ingredientName) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: ingredientName
    }
}

export const removeIngredient = (ingredientName) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: ingredientName
    }
}

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    }
}

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
}

export const initIngredients = () => {
    return dispatch => {
                axios.get('https://react-burger-builder-svr-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json')
                    .then(response => {
                        dispatch(setIngredients(response.data)); 
                    })
                    .catch( error => {
                        dispatch(fetchIngredientsFailed());
                    })
    };
};

export const fetchIngredientPricesFailed = (error) => {
    return {
        type: actionTypes.FETCH_INGREDIENT_PRICES_FAILED,
        error: error
    }
}

export const fetchIngredientPricesSuccess = (prices) => {
    return {
        type: actionTypes.FETCH_INGREDIENT_PRICES_SUCCESS,
        prices: prices
    }
}

export const fetchIngredientPrices = () => {
    return dispatch => {
        axios.get('/prices.json')
            .then( response => {
                dispatch(fetchIngredientPricesSuccess(response.data));
            })
            .catch(error => {
                dispatch(fetchIngredientPricesFailed(error));
            })
    }
}