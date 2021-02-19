import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const fetchUserContactDataSuccess = (contactData) => {
    return {
        type: actionTypes.FETCH_USER_CONTACT_DATA_SUCCESS,
       contactData: contactData
    }
}
export const fetchUserContactDataFail = (error) => {
    return {
        type: actionTypes.FETCH_USER_CONTACT_DATA_FAIL,
        error: error
    }
}

const sortOrdersByDate = (orders) => {
    return orders.sort((a, b) => new Date(b.date) -new Date(a.date));
}

export const fetchUserContactDataStart = (token, userId) => {
    return dispatch => {
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
        axios.get('/orders.json'+queryParams)
        .then(response => {
            const fetchedOrders = [];
            for (let key in response.data) {
                fetchedOrders.push({
                    ...response.data[key],
                    id: key
                });
            }

            const sortedOrders = sortOrdersByDate(fetchedOrders);
            const contactData = {
                ...sortedOrders[0].orderData //Choosing the first nested object from the sortedOrders object
            }
            console.log('Contact Data from latest order: ', contactData);
           
            dispatch(fetchUserContactDataSuccess(contactData));
        })
        .catch(error => {
            dispatch(fetchUserContactDataFail(error));
        })
}
}