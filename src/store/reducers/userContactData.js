/* eslint-disable default-case */
import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../helpers/utility/utility';

const initialState = {
    contactData: null
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.RESET_USER_CONTACT_DATA:
            return updateObject(state, {
                contactData: null
            })

        case actionTypes.FETCH_USER_CONTACT_DATA_SUCCESS:
            return updateObject(state, {
               contactData: action.contactData
            });
    }
    return state;
}

export default reducer;