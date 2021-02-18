import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../helpers/utility/utility';

const initialState = {
    orders: [],
    loading: false,
    purchased: false
}

const reducer = (state = initialState, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
        case actionTypes.PURCHASE_INIT :
            return updateObject(state, {purchased: false});

        case actionTypes.PURCHASE_BURGER_START:
            return updateObject(state, {loading: true});

        case actionTypes.PURCHASE_BURGER_SUCCESS:
            const newOrder = {
                ...action.orderData,
                id: action.orderId,
            }
            const updatedProperties1 = {
                loading: false,
                orders: state.orders.concat(newOrder),
                purchased: true
            }
            return updateObject(state, updatedProperties1);

        case actionTypes.PURCHASE_BURGER_FAILED:
            return updateObject(state, {loading: false});

        case actionTypes.FETCH_ORDERS_START:
            return updateObject(state, {loading:true});
        
        case actionTypes.FETCH_ORDERS_SUCCESS:
            return updateObject(state, {orders: action.orders, loading: false});

        case actionTypes.FETCH_ORDERS_FAIL:
            return updateObject(state, {loading:false});
        default: 
            return state;
    }
    
    
}

export default reducer;