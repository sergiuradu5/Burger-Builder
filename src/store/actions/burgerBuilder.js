import * as actionTypes from './actionTypes';

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
    return {
        type: actionTypes.INIT_INGREDIENTS
    }
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
    return {
        type: actionTypes.FETCH_INGREDIENT_PRICES
    }
}