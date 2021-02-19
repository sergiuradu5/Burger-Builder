/* eslint-disable default-case */
import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../helpers/utility/utility';

const initialState = {
    contactData: null,
    previousContactDataExists: false
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.FETCH_USER_CONTACT_DATA_SUCCESS:
            return updateObject(state, {
               contactData: action.contactData
            });
    }
    return state;
}

export default reducer;