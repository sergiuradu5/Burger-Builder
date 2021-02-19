import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';
import {ToastNotification} from '../../components/UI/ToastNotification/ToastNotification';

export const purchaseBurgerSuccess = (id, orderData) => {
    ToastNotification({
        title: "Order Placed Successfuly",
        message: " ",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
    });
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    };
};

export const purchaseBurgerFailed = (error) => {
    ToastNotification({
        title: "Order Failed!",
        message: " ",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
    });
    return {
        type: actionTypes.PURCHASE_BURGER_FAILED,
        error: error
    }

}

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START,
    }
}

export const purchaseBurger = (orderData, token, ) => {
    return dispatch => {

       dispatch(purchaseBurgerStart());
        axios.post('orders.json?auth=' + token, orderData)
            .then(response => {
                dispatch(purchaseBurgerSuccess(response.data.name, orderData));
            })
            .catch(error => {
                dispatch(purchaseBurgerFailed(error));
            })
    }
}

export const purchaseInit = () => {
    return {
         type: actionTypes.PURCHASE_INIT
    }
}

export const fetchOrdersSuccess = (orders) => {
    //Sorting the orders, from the latest, to the oldest order
    const sortedOrders = orders.sort((a, b) => new Date(b.date) -new Date(a.date));
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: sortedOrders
    }
}

export const fetchOrdersFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: error,
    }
}

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START, 
    }
}

export const fetchOrders = (token, userId) => {
    return dispatch => {
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
        dispatch(fetchOrdersStart());
        axios.get('/orders.json'+queryParams)
            .then(response => {
                const fetchedOrders = [];
                for (let key in response.data) {
                    console.log(response.data[key]);
                    fetchedOrders.push({
                        ...response.data[key],
                        id: key
                    });
                }
                dispatch(fetchOrdersSuccess(fetchedOrders));
            })
            .catch(error => {
                dispatch(fetchOrdersFail(error));
            })
    }
}