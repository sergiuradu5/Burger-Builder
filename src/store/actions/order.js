import * as actionTypes from './actionTypes';
import {ToastNotification} from '../../components/UI/ToastNotification/ToastNotification';

export const purchaseBurgerSuccess = (id, orderData) => {
    ToastNotification({
        title: "Order Placed Successfuly",
        message: " ",
        type: "success",
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
    return {
        type: actionTypes.PURCHASE_BURGER,
        orderData: orderData,
        token: token
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
    return {
        type: actionTypes.FETCH_ORDERS,
        token: token,
        userId: userId,
    }
}